import { StructureMillesimeApiType } from "@/schemas/api/structure-millesime.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateStructureMillesimes = async (
  tx: PrismaTransaction,
  structureMillesimes: StructureMillesimeApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!structureMillesimes || structureMillesimes.length === 0) {
    return;
  }

  await Promise.all(
    structureMillesimes.map((millesime) =>
      tx.structureMillesime.upsert({
        where: {
          structureDnaCode_date: {
            structureDnaCode,
            date: millesime.date,
          },
        },
        update: millesime,
        create: {
          structureDnaCode,
          ...millesime,
        },
      })
    )
  );
};
