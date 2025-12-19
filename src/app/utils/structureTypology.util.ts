import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { structureTypologieSchemaTypeFormValues } from "@/schemas/forms/base/structureTypologie.schema";

import { getTypePlacesYearRange } from "./date.util";

export const getStructureTypologyDefaultValues = (
  structureTypologies: StructureTypologieApiType[]
): structureTypologieSchemaTypeFormValues[] => {
  const { years } = getTypePlacesYearRange();

  return Array(years.length)
    .fill({})
    .map((_, index) => ({
      year: years[index],
    }))
    .map((emptyStructureTypology) => {
      const structureTypology = structureTypologies.find(
        (structureTypology) =>
          structureTypology.year === emptyStructureTypology.year
      );
      return {
        ...structureTypology,
        year: structureTypology?.year ?? emptyStructureTypology.year,
        placesAutorisees: structureTypology?.placesAutorisees || undefined,
        pmr: structureTypology?.pmr || undefined,
        lgbt: structureTypology?.lgbt || undefined,
        fvvTeh: structureTypology?.fvvTeh || undefined,
        placesACreer: structureTypology?.placesACreer || undefined,
        placesAFermer: structureTypology?.placesAFermer || undefined,
        echeancePlacesACreer:
          structureTypology?.echeancePlacesACreer || undefined,
        echeancePlacesAFermer:
          structureTypology?.echeancePlacesAFermer || undefined,
      };
    }) as structureTypologieSchemaTypeFormValues[];
};
