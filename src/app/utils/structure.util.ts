import { Structure } from "@/types/structure.type";
import { sortKeysByValue } from "./common.util";

export const computeNbPlaces = (attachedStructures: Structure[]): number => {
  return attachedStructures.reduce((accumulator, attachedStructure) => {
    return accumulator + attachedStructure.nbPlaces;
  }, 0);
};

export const getPlacesByCommunes = (
  structures: Structure[]
): Record<string, number> => {
  const placesByCommune = structures.reduce(
    (accumulator: Record<string, number>, currentStructure) => {
      const existingCommune = Object.keys(accumulator).find(
        (commune) => commune === currentStructure.communeHebergement
      );

      if (!existingCommune) {
        accumulator[currentStructure.communeHebergement] =
          currentStructure.nbPlaces;
      } else {
        accumulator[currentStructure.communeHebergement] +=
          currentStructure.nbPlaces;
      }
      return accumulator;
    },
    {}
  );
  return sortKeysByValue(placesByCommune);
};
