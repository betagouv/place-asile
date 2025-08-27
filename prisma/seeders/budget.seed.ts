import { Budget } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeBudget = ({
  year,
}: CreateFakeBudgetOptions): Omit<Budget, "id" | "structureDnaCode"> => {
  return {
    date: new Date(year, 0, 1, 13),
    ETP: faker.number.int({ min: 1, max: 30 }),
    tauxEncadrement: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    coutJournalier: faker.number.int({ min: 1, max: 30 }),
    dotationDemandee: faker.number.int({ min: 1, max: 10000 }),
    dotationAccordee: faker.number.int({ min: 1, max: 10000 }),
    totalProduits: faker.number.int({ min: 1, max: 10000 }),
    totalCharges: faker.number.int({ min: 1, max: 10000 }),
    totalChargesProposees: faker.number.int({ min: 1, max: 10000 }),
    cumulResultatsNetsCPOM: faker.number.int({ min: 1, max: 10000 }),
    repriseEtat: faker.number.int({ min: 1, max: 10000 }),
    excedentRecupere:
      faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10000 }), {
        probability: 0.3,
      }) ?? null,
    excedentDeduit:
      faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10000 }), {
        probability: 0.3,
      }) ?? null,
    affectationReservesFondsDedies: faker.number.int({ min: 1, max: 10000 }),
    reserveInvestissement: faker.number.int({ min: 1, max: 10000 }),
    chargesNonReconductibles: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationDeficits: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationBFR: faker.number.int({ min: 1, max: 10000 }),
    reserveCompensationAmortissements: faker.number.int({ min: 1, max: 10000 }),
    fondsDedies: faker.number.int({ min: 1, max: 10000 }),
    commentaire: faker.lorem.lines(2),
  };
};

type CreateFakeBudgetOptions = {
  year: number;
};
