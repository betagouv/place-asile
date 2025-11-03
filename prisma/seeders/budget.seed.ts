import { fakerFR as faker } from "@faker-js/faker";
import { Budget, PrismaClient } from "@prisma/client";

import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { StructureType } from "@/types/structure.type";

export const createFakeBudget = ({
  year,
  type,
  cpom,
}: CreateFakeBudgetOptions): Omit<Budget, "id" | "structureId" | "structureDnaCode"> => {
  const isAutorisee = isStructureAutorisee(type);
  const isSubventionnee = isStructureSubventionnee(type);
  const currentYear = new Date().getFullYear();

  if (isSubventionnee && year >= currentYear - 1) {
    return {
      date: new Date(year, 0, 1, 13),
      ETP: faker.number.int({ min: 1, max: 30 }),
      tauxEncadrement: faker.number.float({
        min: 1,
        max: 10,
        fractionDigits: 2,
      }),
      coutJournalier: faker.number.int({ min: 1, max: 30 }),
    } as Budget;
  }

  return {
    date: new Date(year, 0, 1, 13),
    ETP: faker.number.int({ min: 1, max: 30 }),
    tauxEncadrement: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    coutJournalier: faker.number.int({ min: 1, max: 30 }),
    dotationDemandee: faker.number.int({ min: 1, max: 10000 }),
    dotationAccordee: faker.number.int({ min: 1, max: 10000 }),
    totalProduits:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    totalCharges:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    totalChargesProposees:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    cumulResultatsNetsCPOM:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    repriseEtat:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    excedentRecupere: faker.number.int({ min: 1, max: 10000 }) ?? null,
    excedentDeduit: faker.number.int({ min: 1, max: 10000 }) ?? null,
    affectationReservesFondsDedies:
      year <= currentYear - 2 ? faker.number.int({ min: 1, max: 10000 }) : null,
    reserveInvestissement: faker.number.int({ min: 1, max: 10000 }),
    chargesNonReconductibles: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationDeficits: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationBFR: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationAmortissements: faker.number.int({ min: 1, max: 10000 }),
    fondsDedies: faker.number.int({ min: 1, max: 10000 }),
    reportANouveau:
      isAutorisee || (isSubventionnee && cpom)
        ? faker.number.int({ min: 1, max: 10000 })
        : null,
    autre: faker.number.int({ min: 1, max: 10000 }),
    commentaire: faker.lorem.lines(2),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

export async function insertBudgets(
  prisma: PrismaClient,
  structure: { id: number },
  budgets: Omit<Budget, "id" | "structureId">[]
): Promise<void> {
  for (const b of budgets || []) {
    await prisma.budget.create({
      data: {
        structureId: structure.id,
        date: b.date,
        ETP: b.ETP,
        tauxEncadrement: b.tauxEncadrement,
        coutJournalier: b.coutJournalier,
        dotationDemandee: b.dotationDemandee,
        dotationAccordee: b.dotationAccordee,
        totalProduits: b.totalProduits,
        totalCharges: b.totalCharges,
        totalChargesProposees: b.totalChargesProposees,
        cumulResultatsNetsCPOM: b.cumulResultatsNetsCPOM,
        repriseEtat: b.repriseEtat,
        excedentRecupere: b.excedentRecupere,
        excedentDeduit: b.excedentDeduit,
        reserveInvestissement: b.reserveInvestissement,
        chargesNonReconductibles: b.chargesNonReconductibles,
        reserveCompensationDeficits: b.reserveCompensationDeficits,
        reserveCompensationBFR: b.reserveCompensationBFR,
        reserveCompensationAmortissements: b.reserveCompensationAmortissements,
        fondsDedies: b.fondsDedies,
        affectationReservesFondsDedies: b.affectationReservesFondsDedies,
        reportANouveau: b.reportANouveau,
        autre: b.autre,
        commentaire: b.commentaire,
      },
    });
  }
}

type CreateFakeBudgetOptions = {
  year: number;
  type: StructureType;
  cpom: boolean;
};
