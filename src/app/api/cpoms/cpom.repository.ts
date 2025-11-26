import { CpomMillesimeApiType } from "@/schemas/api/cpom.schema";
import { PrismaTransaction } from "@/types/prisma.type";

export const createOrUpdateCpomMillesimes = async (
  tx: PrismaTransaction,
  millesimes: CpomMillesimeApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!millesimes || millesimes.length === 0) {
    return;
  }

  const structure = await tx.structure.findUnique({
    where: { dnaCode: structureDnaCode },
    select: { id: true },
  });

  if (!structure) {
    throw new Error(
      `Structure avec le code DNA ${structureDnaCode} non trouvée`
    );
  }

  // get cpoms associated to the structure
  const cpomStructures = await tx.cpomStructure.findMany({
    where: { structureId: structure.id },
    include: {
      cpom: {
        select: {
          id: true,
          debutCpom: true,
          finCpom: true,
        },
      },
    },
  });

  if (cpomStructures.length === 0) {
    console.warn(
      `Aucun CPOM associé à la structure ${structureDnaCode}, millesimes ignorés`
    );
    return;
  }

  // for each millesime, find corresponding cpom (with two checks: date between debutCpom and finCpom and structure was in the cpom at this date)
  await Promise.all(
    millesimes.map(async (millesime) => {
      const millesimeDate = new Date(millesime.date);

      const matchingCpom = cpomStructures.find((cpomStructure) => {
        const debutCpom = new Date(cpomStructure.cpom.debutCpom);
        const finCpom = new Date(cpomStructure.cpom.finCpom);

        // check if the millesime date is within the cpom period
        if (millesimeDate < debutCpom || millesimeDate > finCpom) {
          return false;
        }

        // check if the structure was in the cpom at this date
        const dateDebutStructure = cpomStructure.dateDebut
          ? new Date(cpomStructure.dateDebut)
          : debutCpom;
        const dateFinStructure = cpomStructure.dateFin
          ? new Date(cpomStructure.dateFin)
          : finCpom;

        return (
          millesimeDate >= dateDebutStructure &&
          millesimeDate <= dateFinStructure
        );
      });

      if (!matchingCpom) {
        console.warn(
          `Aucun CPOM trouvé pour la structure ${structureDnaCode} avec une période couvrant la date ${millesime.date}, millesime ignoré`
        );
        return;
      }

      const cpomId = matchingCpom.cpom.id;

      return tx.cpomMillesime.upsert({
        where: {
          cpomId_date: {
            cpomId: cpomId,
            date: millesimeDate,
          },
        },
        update: millesime,
        create: {
          cpomId,
          ...millesime,
        },
      });
    })
  );
};
