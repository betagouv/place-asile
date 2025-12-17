import { CpomMillesimeApiType } from "@/schemas/api/cpom.schema";

type CpomStructureForMatching = {
  yearStart: number;
  yearEnd: number;
  cpom: {
    id: number;
    yearStart: number;
    yearEnd: number;
  };
};

export const findMatchingCpomForMillesime = (
  cpomStructures: CpomStructureForMatching[],
  millesime: CpomMillesimeApiType
) => {
  const matchingCpom = cpomStructures.find((cpomStructure) => {
    if (
      millesime.year < cpomStructure.cpom.yearStart ||
      millesime.year > cpomStructure.cpom.yearEnd
    ) {
      return false;
    }

    const yearDebutStructure =
      cpomStructure.yearStart || cpomStructure.cpom.yearStart;
    const yearFinStructure =
      cpomStructure.yearEnd || cpomStructure.cpom.yearEnd;

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
