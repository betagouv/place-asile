import { normalizeAccents } from "@/app/utils/string.util";
import { Operateur } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

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
