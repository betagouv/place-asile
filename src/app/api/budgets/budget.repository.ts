import { BudgetApiType } from "@/schemas/api/budget.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateBudgets = async (
  tx: PrismaTransaction,
  budgets: BudgetApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!budgets || budgets?.length === 0) {
    return;
  }

  await Promise.all(
    (budgets || []).map((budget) => {
      return tx.budget.upsert({
        where: {
          structureDnaCode_year: {
            structureDnaCode: structureDnaCode,
            year: budget.year,
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
