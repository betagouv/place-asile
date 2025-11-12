import prisma from "@/lib/prisma";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";

export const updateStructureTypologies = async (
  typologies: Partial<StructureTypologieApiType>[] | undefined
): Promise<void> => {
  await Promise.all(
    (typologies || []).map((typologie) => {
      return prisma.structureTypologie.update({
        where: { id: typologie.id },
        data: typologie,
      });
    })
  );
};
