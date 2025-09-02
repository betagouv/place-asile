import { Operateur, Prisma } from "@prisma/client";

import prisma from "../../../../lib/prisma";
import { CreateOperateurs } from "./operateur.types";

export const findBySearchTerm = async (
  searchTerm: string | null
): Promise<Operateur[]> => {
  if (!searchTerm) {
    return [];
  }
  return prisma.operateur.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
  });
};

export const createOne = async (
  operateurs: CreateOperateurs
): Promise<Prisma.BatchPayload> => {
  const newOperateurs = await prisma.operateur.createMany({
    data: operateurs,
  });

  return newOperateurs;
};
