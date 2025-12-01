import { CpomMillesimeCreationApiType } from "@/schemas/api/cpom.schema";

type CpomStructureForMatching = {
  dateDebut: Date | null;
  dateFin: Date | null;
  cpom: {
    id: number;
    debutCpom: Date | string;
    finCpom: Date | string;
  };
};

export const findMatchingCpomForMillesime = (
  cpomStructures: CpomStructureForMatching[],
  millesime: CpomMillesimeCreationApiType
) => {
  const millesimeDate = new Date(millesime.date);
  const matchingCpom = cpomStructures.find((cpomStructure) => {
    const debutCpom = new Date(cpomStructure.cpom.debutCpom);
    const finCpom = new Date(cpomStructure.cpom.finCpom);

    if (millesimeDate < debutCpom || millesimeDate > finCpom) {
      return false;
    }

    const dateDebutStructure = cpomStructure.dateDebut
      ? new Date(cpomStructure.dateDebut)
      : debutCpom;
    const dateFinStructure = cpomStructure.dateFin
      ? new Date(cpomStructure.dateFin)
      : finCpom;

    return (
      millesimeDate >= dateDebutStructure && millesimeDate <= dateFinStructure
    );
  });

  if (!matchingCpom) {
    return null;
  }

  return {
    cpomId: matchingCpom.cpom.id,
    date: millesimeDate,
  };
};
