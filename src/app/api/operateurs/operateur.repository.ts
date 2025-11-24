import { normalizeAccents } from "@/app/utils/string.util";
import { Operateur, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { OperateurApiType } from "@/schemas/api/operateur.schema";

export const findBySearchTerm = async (
  searchTerm: string | null
): Promise<Operateur[]> => {
  if (!searchTerm) {
    return [];
  }

  const operateurs = await prisma.operateur.findMany({});
  return operateurs.filter((operateur) =>
    normalizeAccents(operateur.name).includes(normalizeAccents(searchTerm))
  );
};

export const createOne = async (
  operateurs: OperateurApiType[]
): Promise<Prisma.BatchPayload> => {
  const newOperateurs = await prisma.operateur.createMany({
    data: operateurs,
  });

  return newOperateurs;
};
