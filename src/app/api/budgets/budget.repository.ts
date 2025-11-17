import { BudgetApiType } from "@/schemas/api/budget.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateBudgets = async (
  tx: PrismaTransaction,
  budgets: BudgetApiType[] | undefined,
  structureId: number
): Promise<void> => {
  if (!budgets || budgets.length === 0) {
    return;
  }

  await Promise.all(
    budgets.map((budget) =>
      tx.budget.upsert({
        where: {
          structureId_date: {
            structureId,
            date: budget.date,
          },
        },
        update: budget,
        create: {
          structureId,
          ...budget,
        },
      })
    )
  );
};
