import { BudgetApiType } from "@/schemas/api/budget.schema";

import { getYearRange } from "./date.util";

export const getBudgetsDefaultValues = (
  structureBudgets: BudgetApiType[]
): [
  BudgetApiType,
  BudgetApiType,
  BudgetApiType,
  BudgetApiType,
  BudgetApiType,
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
        };
      }
      return emptyBudget;
    }) as [
    BudgetApiType,
    BudgetApiType,
    BudgetApiType,
    BudgetApiType,
    BudgetApiType,
  ];

  return budgets;
};
