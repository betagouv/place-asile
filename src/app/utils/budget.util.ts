import { BudgetApiType } from "@/schemas/api/budget.schema";
import { budgetSchemaTypeFormValues } from "@/schemas/forms/base/finance.schema";

import { getYearRange } from "./date.util";

export const getBudgetsDefaultValues = (
  structureBudgets: BudgetApiType[]
): [
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
] => {
  const { years } = getYearRange();

  const budgetsFilteredByYears =
    structureBudgets.filter((budget) =>
      years.includes(new Date(budget.date).getFullYear())
    ) || [];

  const budgets = Array(5)
    .fill({})
    .map((_, index) => ({
      date: new Date(years[index], 0, 1, 13).toISOString(),
    }))
    .map((emptyBudget, index) => {
      if (index < budgetsFilteredByYears.length) {
        const budget = budgetsFilteredByYears[index];
        return {
          ...budget,
          date: budget.date,
          ETP: budget.ETP ?? undefined,
          tauxEncadrement: budget.tauxEncadrement ?? undefined,
          coutJournalier: budget.coutJournalier ?? undefined,
          dotationDemandee: budget.dotationDemandee ?? undefined,
          dotationAccordee: budget.dotationAccordee ?? undefined,
          totalProduits: budget.totalProduits ?? undefined,
          totalCharges: budget.totalCharges ?? undefined,
          totalChargesProposees: budget.totalChargesProposees ?? undefined,
          cumulResultatsNetsCPOM: budget.cumulResultatsNetsCPOM ?? undefined,
          repriseEtat: budget.repriseEtat ?? undefined,
          excedentRecupere: budget.excedentRecupere ?? undefined,
          excedentDeduit: budget.excedentDeduit ?? undefined,
          reserveInvestissement: budget.reserveInvestissement ?? undefined,
          chargesNonReconductibles:
            budget.chargesNonReconductibles ?? undefined,
          reserveCompensationDeficits:
            budget.reserveCompensationDeficits ?? undefined,
          reserveCompensationBFR: budget.reserveCompensationBFR ?? undefined,
          reserveCompensationAmortissements:
            budget.reserveCompensationAmortissements ?? undefined,
          fondsDedies: budget.fondsDedies ?? undefined,
          affectationReservesFondsDedies:
            budget.affectationReservesFondsDedies ?? undefined,
          reportANouveau: budget.reportANouveau ?? undefined,
          autre: budget.autre ?? undefined,
          commentaire: budget.commentaire ?? undefined,
        };
      }
      return emptyBudget;
    }) as [
    budgetSchemaTypeFormValues,
    budgetSchemaTypeFormValues,
    budgetSchemaTypeFormValues,
    budgetSchemaTypeFormValues,
    budgetSchemaTypeFormValues,
  ];

  return budgets;
};
