import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const updateStructureTypologies = async (
  tx: PrismaTransaction,
  typologies: Partial<StructureTypologieApiType>[] | undefined
): Promise<void> => {
  await Promise.all(
    (typologies || []).map((typologie) => {
      return tx.structureTypologie.update({
        where: { id: typologie.id },
        data: typologie,
      });
    })
  );
};
