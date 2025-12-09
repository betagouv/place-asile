// One off script to change the dates for millesimes in the Budget, AdresseTypologie and StructureTypologie tables
// Usage: yarn one-off 20251204-change-dates-for-millesimes

import "dotenv/config";

import { createPrismaClient } from "@/prisma-client";

import { normalizeYearDate } from "../utils/parse-date";

const prisma = createPrismaClient();

const changeDatesForMillesimes = async () => {
  try {
    console.log("📥 Récupération des enregistrements à corriger...");

    const budgets = await prisma.budget.findMany({
      select: { id: true, date: true },
    });

    const adresseTypologies = await prisma.adresseTypologie.findMany({
      select: { id: true, date: true },
    });

    const structureTypologies = await prisma.structureTypologie.findMany({
      select: { id: true, date: true },
    });

    const totalCount =
      budgets.length + adresseTypologies.length + structureTypologies.length;

    if (totalCount === 0) {
      console.log("✓ Aucun enregistrement à corriger");
      return;
    }

    console.log(
      `✓ ${budgets.length} Budget, ${adresseTypologies.length} AdresseTypologie, ${structureTypologies.length} StructureTypologie trouvés`
    );
    console.log("🔄 Correction des dates...");

    let updatedBudgets = 0;
    let updatedAdresseTypologies = 0;
    let updatedStructureTypologies = 0;
    let errorCount = 0;

    for (const budget of budgets) {
      try {
        const normalizedDate = normalizeYearDate(budget.date);
        if (normalizedDate.getTime() !== budget.date.getTime()) {
          await prisma.budget.update({
            where: { id: budget.id },
            data: { date: normalizedDate },
          });
          updatedBudgets += 1;
        }
      } catch (error) {
        errorCount += 1;
        console.error(`❌ Erreur pour Budget id=${budget.id}:`, error);
      }
    }

    for (const adresseTypologie of adresseTypologies) {
      try {
        const normalizedDate = normalizeYearDate(adresseTypologie.date);
        if (normalizedDate.getTime() !== adresseTypologie.date.getTime()) {
          await prisma.adresseTypologie.update({
            where: { id: adresseTypologie.id },
            data: { date: normalizedDate },
          });
          updatedAdresseTypologies += 1;
        }
      } catch (error) {
        errorCount += 1;
        console.error(
          `❌ Erreur pour AdresseTypologie id=${adresseTypologie.id}:`,
          error
        );
      }
    }

    for (const structureTypologie of structureTypologies) {
      try {
        const normalizedDate = normalizeYearDate(structureTypologie.date);
        if (normalizedDate.getTime() !== structureTypologie.date.getTime()) {
          await prisma.structureTypologie.update({
            where: { id: structureTypologie.id },
            data: { date: normalizedDate },
          });
          updatedStructureTypologies += 1;
        }
      } catch (error) {
        errorCount += 1;
        console.error(
          `❌ Erreur pour StructureTypologie id=${structureTypologie.id}:`,
          error
        );
      }
    }

    console.log(
      `✅ Correction terminée : ${updatedBudgets} Budget, ${updatedAdresseTypologies} AdresseTypologie, ${updatedStructureTypologies} StructureTypologie mis à jour${errorCount > 0 ? `, ${errorCount} erreurs` : ""}`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la correction :", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

changeDatesForMillesimes()
  .then(() => {
    console.log("✓ Script terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur :", error);
    process.exit(1);
  });
