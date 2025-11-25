import { StructureOfii, StructureType } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const findBySearchTerm = async (
  operateurId: string | null,
  departementNumero: string | null,
  type: string | null
): Promise<StructureOfii[]> => {
  if (!operateurId || !departementNumero || !type) {
    return [];
  }

  const structuresOfii = await prisma.structureOfii.findMany({
    where: {
      operateurId: Number(operateurId),
      departement: {
        numero: departementNumero,
      },
      type: type as StructureType,
    },
    include: {
      operateur: true,
      departement: true,
    },
  });

  return structuresOfii.filter((structureOfii) => structureOfii.inactiveSince === null);

};
