import type { PrismaClient } from "@/generated/prisma/client";

type PrismaWithOperateur = Pick<PrismaClient, "operateur">;

/**
 * Vérifie que tous les opérateurs présents dans les records existent en base.
 * Retourne une map name -> id, ou lève une erreur si au moins un est manquant.
 */
export const ensureOperateursExist = async <T extends Record<string, unknown>>(
  prisma: PrismaWithOperateur,
  records: T[],
  columnName: keyof T
): Promise<Map<string, number>> => {
  const operateurNames: string[] = [];
  for (const record of records) {
    const value = record[columnName];
    if (typeof value === "string" && value) {
      operateurNames.push(value);
    }
  }

  const uniqueNames = [...new Set(operateurNames)];

  if (uniqueNames.length === 0) {
    return new Map();
  }

  const existingOperateurs = await prisma.operateur.findMany({
    where: { name: { in: uniqueNames } },
    select: { id: true, name: true },
  });

  const operateurMap = new Map(
    existingOperateurs.map((op) => [op.name, op.id])
  );

  const missingOperateurs = uniqueNames.filter((nom) => !operateurMap.has(nom));

  if (missingOperateurs.length > 0) {
    const list = missingOperateurs.join(", ");
    throw new Error(
      `Les opérateurs suivants sont présents dans le CSV mais inconnus en base : ${list}`
    );
  }

  return operateurMap;
};
