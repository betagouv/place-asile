import { Budget } from "@/types/budget.type";

export const createBudget = ({
  id,
  structureDnaCode,
  date,
  ...overrides
}: Partial<Budget> = {}): Budget => {
  return {
    id: id ?? 1,
    structureDnaCode: structureDnaCode ?? "C0001",
    date: date ?? "2024",
    ETP: 10,
    tauxEncadrement: 0.15,
    coutJournalier: 50,
    dotationDemandee: 1000000,
    dotationAccordee: 950000,
    totalProduits: 1000000,
    totalCharges: 980000,
    totalChargesProposees: 930000,
    cumulResultatsNetsCPOM: 50000,
    repriseEtat: 10000,
    excedentRecupere: 5000,
    excedentDeduit: 3000,
    reserveInvestissement: 20000,
    chargesNonReconductibles: 15000,
    reserveCompensationDeficits: 10000,
    reserveCompensationBFR: 8000,
    reserveCompensationAmortissements: 7000,
    affectationReservesFondsDedies: 5000,
    autre: 2000,
    reportANouveau: 20000,
    fondsDedies: 10000,
    commentaire: "Test budget",
    ...overrides,
  };
};

export const createBudgetArray = (count: number): Budget[] => {
  return Array.from({ length: count }, (_, i) =>
    createBudget({ date: `${2024 - i}` })
  );
};
