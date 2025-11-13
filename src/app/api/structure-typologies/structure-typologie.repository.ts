import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const updateStructureTypologies = async (
  tx: PrismaTransaction,
  structureTypologies: Partial<StructureTypologieApiType>[] | undefined
): Promise<void> => {
  if (!structureTypologies || structureTypologies.length === 0) {
    return;
  }

  await Promise.all(
    (structureTypologies || []).map((typologie) => {
      return tx.structureTypologie.update({
        where: { id: typologie.id },
        data: typologie,
      });
    })
  );
};
