// Fill Structure table with csv from s3 bucket
// Usage: yarn script fill-structure-ofii my_structure_ofii_file.csv
// An example of the csv file is available at /public/ofii_example.csv

import "dotenv/config";

import { StructureType } from "@/generated/prisma/client";
import { createPrismaClient } from "@/prisma-client";

import { loadCsvFromS3 } from "../utils/csv-loader";

const prisma = createPrismaClient();
const bucketName = process.env.DOCS_BUCKET_NAME!;
const args = process.argv.slice(2);
const csvFilename = args[0];

if (!csvFilename) {
  throw new Error(
    "Merci de fournir le nom du fichier CSV en argument du script."
  );
}

type OfiiCsvRow = {
  dnaCode: string;
  nom: string;
  type: string;
  operateur_nom?: string;
  departement: string;
  direction_territoriale?: string;
  nom_ofii?: string;
};

// open csv and load data into Structure table (OFII-related fields only)
const loadDataToOfiiTable = async () => {
  try {
    const records = await loadCsvFromS3<OfiiCsvRow>(bucketName, csvFilename);

    if (records.length === 0) {
      return;
    }

    console.log("Résolution des IDs des opérateurs...");
    const operateurs = await prisma.operateur.findMany({
      select: { id: true, name: true },
    });
    const operateurMap = new Map(operateurs.map((op) => [op.name, op.id]));

    // create missing opérateurs
    const operateursInCsv = [
      ...new Set(
        records
          .map((r: OfiiCsvRow) => r.operateur_nom)
          .filter((nom): nom is string => !!nom)
      ),
    ];

    const missingOperateurs = operateursInCsv.filter(
      (nom) => !operateurMap.has(nom)
    );

    if (missingOperateurs.length > 0) {
      console.log(
        `Création de ${missingOperateurs.length} opérateurs manquants...`
      );
      for (const nom of missingOperateurs) {
        const newOperateur = await prisma.operateur.create({
          data: { name: nom },
        });
        operateurMap.set(nom, newOperateur.id);
        console.log(`-> Opérateur créé: ${nom}`);
      }
    }

    console.log("Résolution des IDs des départements...");
    const departements = await prisma.departement.findMany({
      select: { numero: true },
    });
    const departementSet = new Set(departements.map((dep) => dep.numero));

    // Validation des données
    console.log("Validation des données...");

    const validRecords: OfiiCsvRow[] = [];
    const errors: { dnaCode: string; issues: string[] }[] = [];

    for (const row of records as OfiiCsvRow[]) {
      const issues = [];

      if (!row.departement || !departementSet.has(row.departement)) {
        issues.push(`département invalide: ${row.departement}`);
      }

      if (issues.length > 0) {
        errors.push({ dnaCode: row.dnaCode, issues });
      } else {
        validRecords.push(row);
      }
    }

    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} lignes avec erreurs :`);
      errors.slice(0, 10).forEach((err) => {
        console.log(`  - ${err.dnaCode}: ${err.issues.join(", ")}`);
      });
      if (errors.length > 10) {
        console.log(`  ... et ${errors.length - 10} autres erreurs`);
      }
    }

    if (validRecords.length === 0) {
      console.log("❌ Aucune donnée valide à insérer");
      return;
    }

    console.log(
      `✓ ${validRecords.length} lignes valides sur ${records.length}`
    );

    console.log("Mise à jour des données ofii...");
    let createdCount = 0;
    let updatedCount = 0;

    const existingStructures = await prisma.structure.findMany({
      where: { dnaCode: { in: validRecords.map((r) => r.dnaCode) } },
      select: {
        dnaCode: true,
        activeInOfiiFileSince: true,
        inactiveInOfiiFileSince: true,
      },
    });
    const existingByDnaCode = new Map(
      existingStructures.map((s) => [s.dnaCode, s])
    );

    await prisma.$transaction(async (tx) => {
      for (const row of validRecords) {
        const existing = existingByDnaCode.get(row.dnaCode);
        const now = new Date();

        await tx.structure.upsert({
          where: { dnaCode: row.dnaCode },
          update: {
            nomOfii: row.nom ?? undefined,
            directionTerritoriale: row.direction_territoriale ?? undefined,
            inactiveInOfiiFileSince: null,
          },
          create: {
            dnaCode: row.dnaCode,
            nom: row.nom,
            type: row.type as StructureType,
            departementAdministratif: row.departement ?? undefined,
            nomOfii: row.nom ?? undefined,
            directionTerritoriale: row.direction_territoriale ?? undefined,
            activeInOfiiFileSince: now,
            inactiveInOfiiFileSince: null,
            operateurId: row.operateur_nom
              ? (operateurMap.get(row.operateur_nom) ?? null)
              : null,
          },
        });

        if (existing) updatedCount += 1;
        else createdCount += 1;
      }

      // Deactivate structures that are not in the CSV
      const csvDnaCodes = new Set(records.map((row) => row.dnaCode));

      const allActiveOfiiStructures = await tx.structure.findMany({
        where: {
          inactiveInOfiiFileSince: null,
        },
        select: { dnaCode: true },
      });

      const dnaCodesToDeactivate = allActiveOfiiStructures
        .map((s) => s.dnaCode)
        .filter((dnaCode) => !csvDnaCodes.has(dnaCode));

      if (dnaCodesToDeactivate.length > 0) {
        const now = new Date();
        const deactivated = await tx.structure.updateMany({
          where: {
            dnaCode: { in: dnaCodesToDeactivate },
            inactiveInOfiiFileSince: null,
          },
          data: { inactiveInOfiiFileSince: now },
        });
        console.log(
          `⚠️ ${deactivated.count} structures marquées comme inactives dans le fichier OFII (absentes du CSV).`
        );
      } else {
        console.log("Aucune structure à désactiver.");
      }
    });

    console.log(
      `✅ ${createdCount} structures créées, ${updatedCount} structures mises à jour`
    );
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

loadDataToOfiiTable();
