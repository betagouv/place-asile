import prisma from "@/lib/prisma";
import { BudgetApiType } from "@/schemas/api/budget.schema";

export const createOrUpdateBudgets = async (
  budgets: BudgetApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (budgets || []).map((budget) => {
      return prisma.budget.upsert({
        where: {
          structureDnaCode_date: {
            structureDnaCode: structureDnaCode,
            date: budget.date,
          },
        },
        update: budget,
        create: {
          structureDnaCode,
          ...budget,
        },
      });
    })
  );
};
