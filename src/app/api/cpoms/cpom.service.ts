import { getYearFromDate } from "@/app/utils/date.util";
import { CpomMillesimeApiType } from "@/schemas/api/cpom.schema";

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
  millesime: CpomMillesimeApiType
) => {
  const matchingCpom = cpomStructures.find((cpomStructure) => {
    const debutCpom = getYearFromDate(cpomStructure.cpom.debutCpom);
    const finCpom = getYearFromDate(cpomStructure.cpom.finCpom);

    if (millesime.year < debutCpom || millesime.year > finCpom) {
      return false;
    }

    const yearDebutStructure = getYearFromDate(
      cpomStructure.dateDebut || debutCpom
    );
    const yearFinStructure = getYearFromDate(cpomStructure.dateFin || finCpom);
    return (
      millesime.year >= yearDebutStructure && millesime.year <= yearFinStructure
    );
  });

  if (!matchingCpom) {
    return null;
  }

  return {
    cpomId: matchingCpom.cpom.id,
    year: millesime.year,
  };
};
