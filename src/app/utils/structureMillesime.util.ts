import { StructureMillesimeApiType } from "@/schemas/api/structure-millesime.schema";

import { getYearRange } from "./date.util";

export const getStructureMillesimeDefaultValues = (
  structureMillesimes: StructureMillesimeApiType[]
): StructureMillesimeApiType[] => {
  const { years } = getYearRange();

  return Array(years.length)
    .fill({})
    .map((_, index) => ({
      year: years[index],
    }))
    .map((emptyStructureMillesime) => {
      const structureMillesime = structureMillesimes.find(
        (structureMillesime) =>
          structureMillesime.year === emptyStructureMillesime.year
      );
      return {
        ...structureMillesime,
        id: structureMillesime?.id ?? undefined,
        year: structureMillesime?.year ?? emptyStructureMillesime.year,
        cpom: structureMillesime?.cpom ?? false,
        operateurComment: structureMillesime?.operateurComment ?? undefined,
      };
    }) as StructureMillesimeApiType[];
};
