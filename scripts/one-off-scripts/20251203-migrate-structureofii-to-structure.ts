// @ts-nocheck

// Migrate all data from StructureOfii to Structure table
// This script merges StructureOfii data into Structure, updating OFII-related fields
// Usage: yarn one-off 20251203-migrate-structureofii-to-structure

import "dotenv/config";

import { StructureType } from "@/generated/prisma/client";
import { createPrismaClient } from "@/prisma-client";

const prisma = createPrismaClient();

const migrateStructureOfiiToStructure = async () => {
  try {
    console.log("📥 Récupération de toutes les entrées StructureOfii...");
    const structuresOfii = await prisma.structureOfii.findMany({
      orderBy: { dnaCode: "asc" },
    });

    if (structuresOfii.length === 0) {
      console.log("✓ Aucune entrée StructureOfii à migrer");
      return;
    }

    console.log(`✓ ${structuresOfii.length} entrées StructureOfii trouvées`);

    console.log("🔄 Migration des données vers Structure...");

    await prisma.$transaction(async (tx) => {
      for (const structureOfii of structuresOfii) {
        await tx.structure.upsert({
          where: { dnaCode: structureOfii.dnaCode },
          update: {
            nomOfii: structureOfii.nom ?? undefined,
            directionTerritoriale:
              structureOfii.directionTerritoriale ?? undefined,
            activeInOfiiFileSince: structureOfii.activeSince ?? undefined,
            inactiveInOfiiFileSince: structureOfii.inactiveSince ?? undefined,
          },
          create: {
            dnaCode: structureOfii.dnaCode,
            type: structureOfii.type as StructureType,
            nom: structureOfii.nom ?? undefined,
            nomOfii: structureOfii.nom ?? undefined,
            directionTerritoriale:
              structureOfii.directionTerritoriale ?? undefined,
            activeInOfiiFileSince: structureOfii.activeSince ?? undefined,
            inactiveInOfiiFileSince: structureOfii.inactiveSince ?? undefined,
            operateurId: structureOfii.operateurId ?? undefined,
            departementAdministratif:
              structureOfii.departementNumero ?? undefined,
          },
        });
      }
    });

    console.log("✅ Migration terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la migration :", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

migrateStructureOfiiToStructure()
  .then(() => {
    console.log("✓ Script terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur :", error);
    process.exit(1);
  });
