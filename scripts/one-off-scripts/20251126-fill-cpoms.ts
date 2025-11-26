import "dotenv/config";

import { parse } from "csv-parse/sync";

import { checkBucket, getObject } from "@/lib/minio";
import { createPrismaClient } from "@/prisma-client";

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
  dates_entree_structure?: string;
  dates_sortie_structure?: string;
};

type ValidatedRow = CpomCsvRow & {
  lineNumber: number;
  debut: Date;
  fin: Date;
  entree?: Date | null;
  sortie?: Date | null;
};

const parseDate = (value: string, context: string): Date => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${context}: valeur vide`);
  }

  const isoCandidate = new Date(trimmed);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  const [day, month, year] = trimmed.split("/");
  if (day && month && year) {
    const fullYear = year.length === 2 ? Number(`20${year}`) : Number(year);
    const parsed = new Date(fullYear, Number(month) - 1, Number(day));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  throw new Error(`${context}: format de date invalide (${value})`);
};

const pickFirstDate = (rawValue: string | undefined, context: string) => {
  if (!rawValue) {
    return null;
  }
  const candidate = rawValue
    .split(/[,;|]/)
    .map((token) => token.trim())
    .find(Boolean);
  return candidate ? parseDate(candidate, context) : null;
};

const loadCpomsFromCsv = async () => {
  try {
    console.log("Vérification du bucket...");
    await checkBucket(bucketName);

    console.log("Récupération du fichier CSV...");
    const stream = await getObject(bucketName, csvFilename);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const csvContent = Buffer.concat(chunks).toString("utf-8");

    console.log("Parsing du CSV...");
    const records = parse<CpomCsvRow>(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`${records.length} lignes trouvées`);
    if (records.length === 0) {
      console.log("⚠️ Aucune donnée à traiter");
      return;
    }

    const validRows: ValidatedRow[] = [];
    const errors: { line: number; issues: string[] }[] = [];

    records.forEach((row, index) => {
      const lineNumber = index + 2;
      const issues: string[] = [];

      if (!row.cpom) issues.push("CPOM manquant");
      if (!row.code_dna) issues.push("code DNA manquant");
      if (!row.date_debut) issues.push("date_debut manquante");
      if (!row.date_fin) issues.push("date_fin manquante");

      let debut: Date | undefined;
      let fin: Date | undefined;
      try {
        if (row.date_debut) {
          debut = parseDate(row.date_debut, `date_debut ligne ${lineNumber}`);
        }
        if (row.date_fin) {
          fin = parseDate(row.date_fin, `date_fin ligne ${lineNumber}`);
        }
      } catch (err) {
        issues.push((err as Error).message);
      }

      if (debut && fin && debut > fin) {
        issues.push("date_debut après date_fin");
      }

      if (issues.length > 0 || !debut || !fin) {
        errors.push({ line: lineNumber, issues });
        return;
      }

      validRows.push({
        ...row,
        lineNumber,
        debut,
        fin,
        entree: pickFirstDate(
          row.dates_entree_structure,
          `dates_entree_structure ligne ${lineNumber}`
        ),
        sortie: pickFirstDate(
          row.dates_sortie_structure,
          `dates_sortie_structure ligne ${lineNumber}`
        ),
      });
    });

    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} lignes ignorées :`);
      errors.slice(0, 10).forEach((err) => {
        console.log(`  - Ligne ${err.line}: ${err.issues.join(", ")}`);
      });
      if (errors.length > 10) {
        console.log(`  ... et ${errors.length - 10} autres erreurs`);
      }
    }

    if (validRows.length === 0) {
      console.log("❌ Aucune ligne exploitable.");
      return;
    }

    const cpomCache = new Map<string, number>();
    const dnaCodes = [...new Set(validRows.map((row) => row.code_dna))];
    const structures = await prisma.structure.findMany({
      where: { dnaCode: { in: dnaCodes } },
      select: { id: true, dnaCode: true },
    });

    const structureMap = new Map(structures.map((s) => [s.dnaCode, s.id]));
    const missingStructures = dnaCodes.filter(
      (code) => !structureMap.has(code)
    );

    if (missingStructures.length > 0) {
      console.log(
        `⚠️ ${missingStructures.length} structures introuvables (elles seront ignorées).`
      );
    }

    let cpomsCreated = 0;
    let linksCreated = 0;
    let linksUpdated = 0;
    let linesSkipped = 0;

    for (const row of validRows) {
      const structureId = structureMap.get(row.code_dna);
      if (!structureId) {
        linesSkipped += 1;
        continue;
      }

      const cpomKey = `${row.cpom}|${row.debut.toISOString()}|${row.fin.toISOString()}`;
      let cpomId = cpomCache.get(cpomKey);

      if (!cpomId) {
        const existingCpom = await prisma.cpom.findFirst({
          where: {
            name: row.cpom,
            debutCpom: row.debut,
            finCpom: row.fin,
          },
          select: { id: true },
        });

        if (existingCpom) {
          cpomId = existingCpom.id;
        } else {
          const created = await prisma.cpom.create({
            data: {
              name: row.cpom,
              debutCpom: row.debut,
              finCpom: row.fin,
            },
            select: { id: true },
          });
          cpomId = created.id;
          cpomsCreated += 1;
          console.log(`✅ CPOM créé "${row.cpom}" (ligne ${row.lineNumber})`);
        }

        cpomCache.set(cpomKey, cpomId);
      }

      const existingLink = await prisma.cpomStructure.findFirst({
        where: {
          cpomId,
          structureId,
        },
        select: { id: true },
      });

      if (existingLink) {
        await prisma.cpomStructure.update({
          where: { id: existingLink.id },
          data: {
            dateDebut: row.entree ?? null,
            dateFin: row.sortie ?? null,
          },
        });
        linksUpdated += 1;
      } else {
        await prisma.cpomStructure.create({
          data: {
            cpomId,
            structureId,
            dateDebut: row.entree ?? null,
            dateFin: row.sortie ?? null,
          },
        });
        linksCreated += 1;
      }
    }

    console.log(`📄 ${validRows.length} lignes valides traitées`);
    console.log(`✅ ${cpomsCreated} CPOM(s) créés`);
    console.log(
      `✅ Liens CPOM/Structure: ${linksCreated} créés, ${linksUpdated} mis à jour`
    );
    if (linesSkipped > 0) {
      console.log(`⚠️ ${linesSkipped} lignes ignorées (structure absente)`);
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

loadCpomsFromCsv();
