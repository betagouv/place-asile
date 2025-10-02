import { Operateur, Prisma } from "@prisma/client";

import { normalizeAccents } from "@/app/utils/string.util";

import prisma from "../../../../lib/prisma";
import { CreateOperateurs } from "./operateur.types";

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
  operateurs: CreateOperateurs
): Promise<Prisma.BatchPayload> => {
  const newOperateurs = await prisma.operateur.createMany({
    data: operateurs,
  });

  return newOperateurs;
};
