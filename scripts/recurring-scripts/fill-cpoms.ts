// Fill Cpom table, link with structures and create associated structure millesimes with csv from s3 bucket
// Usage: yarn script fill-cpoms my_cpom_file.csv
// An example of the csv file is available at /public/cpom_example.csv

import "dotenv/config";

import { createPrismaClient } from "@/prisma-client";

import { loadCsvFromS3 } from "../utils/csv-loader";
import { ensureOperateursExist } from "../utils/ensure-operateurs-exist";
import { parseDate } from "../utils/parse-date";

const prisma = createPrismaClient();
const bucketName = process.env.DOCS_BUCKET_NAME!;
const args = process.argv.slice(2);
const csvFilename = args[0];

if (!csvFilename) {
  throw new Error(
    "Merci de fournir le nom du fichier CSV en argument du script."
  );
}

type CpomCsvRow = {
  cpom: string;
  departement: string;
  code_dna: string;
  typologie?: string;
  operateur?: string;
  date_debut: string;
  date_fin: string;
  date_entree_structure?: string;
  date_sortie_structure?: string;
};

const buildStructureMillesimeDates = (start: Date, end: Date): Date[] => {
  const years: Date[] = [];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  for (let year = startYear; year <= endYear; year++) {
    years.push(new Date(year, 0, 1, 12, 0, 0));
  }
  return years;
};

const loadCpomsFromCsv = async () => {
  try {
    const records = await loadCsvFromS3<CpomCsvRow>(bucketName, csvFilename);

    if (records.length === 0) {
      return;
    }

    // Ensure no operator is missing
    console.log("Résolution des IDs des opérateurs...");
    const operateurMap = await ensureOperateursExist(
      prisma,
      records,
      "operateur"
    );

    // Get all necessary structures
    const dnaCodes = [...new Set(records.map((r) => r.code_dna))];
    const structures = await prisma.structure.findMany({
      where: { dnaCode: { in: dnaCodes } },
      select: { id: true, dnaCode: true },
    });
    const structureMap = new Map(structures.map((s) => [s.dnaCode, s.id]));

    // Group CPOMs by name + dates + operator
    const cpomMap = new Map<
      string,
      { name: string; debut: Date; fin: Date; operateurId: number }
    >();
    const cpomCache = new Map<string, number>();

    for (const row of records) {
      if (!row.cpom || !row.date_debut || !row.date_fin) {
        continue;
      }

      if (!row.operateur) {
        console.log(
          `❌ Ligne ignorée, opérateur manquant pour le CPOM: cpom=${row.cpom}, departement=${row.departement}`
        );
        continue;
      }

      const operateurId = operateurMap.get(row.operateur)!;
      const debut = parseDate(row.date_debut.trim(), `date_debut`);
      const fin = parseDate(row.date_fin.trim(), `date_fin`);
      const key = `${row.cpom} - ${debut.toISOString()} - ${fin.toISOString()} - ${operateurId}`;

      if (!cpomMap.has(key)) {
        cpomMap.set(key, { name: row.cpom, debut, fin, operateurId });
      }
    }

    // Créer ou récupérer les CPOMs
    console.log(`🍎 Création de ${cpomMap.size} CPOM(s)...`);
    for (const [key, cpomData] of cpomMap.entries()) {
      let cpom = await prisma.cpom.findFirst({
        where: {
          name: cpomData.name,
          debutCpom: cpomData.debut,
          finCpom: cpomData.fin,
          operateurId: cpomData.operateurId,
        },
        select: { id: true },
      });

      if (!cpom) {
        cpom = await prisma.cpom.create({
          data: {
            name: cpomData.name,
            debutCpom: cpomData.debut,
            finCpom: cpomData.fin,
            operateurId: cpomData.operateurId,
          },
          select: { id: true },
        });
        console.log(`✅ CPOM créé "${cpomData.name}"`);
      }

      cpomCache.set(key, cpom.id);
    }

    // Create CPOM/Structure links
    console.log("🔗 Création des liens CPOM/Structure...");

    for (const row of records) {
      if (!row.cpom || !row.code_dna || !row.date_debut || !row.date_fin) {
        console.log(
          `❌ Ligne ignorée, champs manquants : cpom=${row.cpom}, code_dna=${row.code_dna}, date_debut=${row.date_debut}, date_fin=${row.date_fin}`
        );
        continue;
      }

      const structureId = structureMap.get(row.code_dna);
      if (!structureId) {
        console.log(
          `❌ Ligne ignorée, structure non trouvée: cpom=${row.cpom}, code_dna=${row.code_dna}, date_debut=${row.date_debut}, date_fin=${row.date_fin}`
        );
        continue;
      }

      const debut = parseDate(row.date_debut.trim(), `date_debut`);
      const fin = parseDate(row.date_fin.trim(), `date_fin`);
      const cpomKey = `${row.cpom} - ${debut.toISOString()} - ${fin.toISOString()}`;
      const cpomId = cpomCache.get(cpomKey);

      if (!cpomId) {
        console.log(
          `❌ Ligne ignorée, CPOM non trouvé: cpom=${row.cpom}, code_dna=${row.code_dna}, date_debut=${row.date_debut}, date_fin=${row.date_fin}`
        );
        continue;
      }

      const dateDebut = row.date_entree_structure?.trim()
        ? parseDate(row.date_entree_structure.trim(), `date_entree_structure`)
        : null;
      const dateFin = row.date_sortie_structure?.trim()
        ? parseDate(row.date_sortie_structure.trim(), `date_sortie_structure`)
        : null;

      const cpomStructure = await prisma.cpomStructure.upsert({
        where: {
          cpomId_structureId: {
            cpomId,
            structureId,
          },
        },
        update: {
          dateDebut,
          dateFin,
        },
        create: {
          cpomId,
          structureId,
          dateDebut,
          dateFin,
        },
      });

      // Create millesimes for the structure
      console.log(
        `🍷 Création des millesimes pour la structure ${row.code_dna}`
      );

      const millesimeStart = dateDebut ?? cpomStructure.dateDebut ?? debut;
      const millesimeEnd = dateFin ?? cpomStructure.dateFin ?? fin;
      const millesimeDates = buildStructureMillesimeDates(
        millesimeStart,
        millesimeEnd
      );

      for (const millesimeDate of millesimeDates) {
        await prisma.structureMillesime.upsert({
          where: {
            structureDnaCode_date: {
              structureDnaCode: row.code_dna,
              date: millesimeDate,
            },
          },
          update: {
            cpom: true,
          },
          create: {
            structureDnaCode: row.code_dna,
            date: millesimeDate,
            cpom: true,
          },
        });
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

loadCpomsFromCsv();
