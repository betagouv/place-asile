import "dotenv/config";

import { createPrismaClient } from "@/prisma-client";
import { loadCsvFromS3 } from "../utils/csv-loader";
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

const loadCpomsFromCsv = async () => {
  try {
    const records = await loadCsvFromS3<CpomCsvRow>(bucketName, csvFilename);

    if (records.length === 0) {
      return;
    }

    // Récupérer toutes les structures nécessaires
    const dnaCodes = [...new Set(records.map((r) => r.code_dna))];
    const structures = await prisma.structure.findMany({
      where: { dnaCode: { in: dnaCodes } },
      select: { id: true, dnaCode: true },
    });
    const structureMap = new Map(structures.map((s) => [s.dnaCode, s.id]));

    // Grouper les CPOMs par nom + dates
    const cpomMap = new Map<string, { name: string; debut: Date; fin: Date }>();
    const cpomCache = new Map<string, number>();

    for (const row of records) {
      if (!row.cpom || !row.date_debut || !row.date_fin) {
        continue;
      }

      const debut = parseDate(row.date_debut.trim(), `date_debut`);
      const fin = parseDate(row.date_fin.trim(), `date_fin`);
      const key = `${row.cpom} - ${debut.toISOString()} - ${fin.toISOString()}`;

      if (!cpomMap.has(key)) {
        cpomMap.set(key, { name: row.cpom, debut, fin });
      }
    }

    // Créer ou récupérer les CPOMs
    console.log(`📄 Création de ${cpomMap.size} CPOM(s)...`);
    for (const [key, cpomData] of cpomMap.entries()) {
      let cpom = await prisma.cpom.findFirst({
        where: {
          name: cpomData.name,
          debutCpom: cpomData.debut,
          finCpom: cpomData.fin,
        },
        select: { id: true },
      });

      if (!cpom) {
        cpom = await prisma.cpom.create({
          data: {
            name: cpomData.name,
            debutCpom: cpomData.debut,
            finCpom: cpomData.fin,
          },
          select: { id: true },
        });
        console.log(`✅ CPOM créé "${cpomData.name}"`);
      }

      cpomCache.set(key, cpom.id);
    }

    // Créer les liens CPOM/Structure
    console.log("📄 Création des liens CPOM/Structure...");
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of records) {
      if (!row.cpom || !row.code_dna || !row.date_debut || !row.date_fin) {
        skipped++;
        continue;
      }

      const structureId = structureMap.get(row.code_dna);
      if (!structureId) {
        skipped++;
        continue;
      }

      const debut = parseDate(row.date_debut.trim(), `date_debut`);
      const fin = parseDate(row.date_fin.trim(), `date_fin`);
      const cpomKey = `${row.cpom} - ${debut.toISOString()} - ${fin.toISOString()}`;
      const cpomId = cpomCache.get(cpomKey);

      if (!cpomId) {
        skipped++;
        continue;
      }

      const dateDebut = row.date_entree_structure?.trim()
        ? parseDate(row.date_entree_structure.trim(), `date_entree_structure`)
        : null;
      const dateFin = row.date_sortie_structure?.trim()
        ? parseDate(row.date_sortie_structure.trim(), `date_sortie_structure`)
        : null;

      const existing = await prisma.cpomStructure.findFirst({
        where: {
          cpomId,
          structureId,
        },
        select: { id: true },
      });

      if (existing) {
        await prisma.cpomStructure.update({
          where: { id: existing.id },
          data: {
            dateDebut,
            dateFin,
          },
        });
        updated++;
      } else {
        await prisma.cpomStructure.create({
          data: {
            cpomId,
            structureId,
            dateDebut,
            dateFin,
          },
        });
        created++;
      }
    }

    console.log(
      `✅ ${created} liens créés, ${updated} liens mis à jour, ${skipped} lignes ignorées`
    );
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

loadCpomsFromCsv();
