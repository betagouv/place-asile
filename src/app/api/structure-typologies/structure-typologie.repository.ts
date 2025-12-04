import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateStructureTypologies = async (
  tx: PrismaTransaction,
  structureTypologies: Partial<StructureTypologieApiType>[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!structureTypologies || structureTypologies.length === 0) {
    return;
  }

  await Promise.all(
    (structureTypologies || []).map((typologie) => {
      return tx.structureTypologie.upsert({
        where: { id: typologie.id || 0 },
        update: {
          date: typologie.date!,
          placesAutorisees: typologie.placesAutorisees,
          pmr: typologie.pmr!,
          lgbt: typologie.lgbt!,
          fvvTeh: typologie.fvvTeh!,
        },
        create: {
          structureDnaCode,
          date: typologie.date!,
          placesAutorisees: typologie.placesAutorisees,
          pmr: typologie.pmr!,
          lgbt: typologie.lgbt!,
          fvvTeh: typologie.fvvTeh!,
        },
      });
    })
  );
};
