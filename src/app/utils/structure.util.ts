import { Logement } from "@/types/logement.type";
import { sortKeysByValue } from "./common.util";

export const getPlacesByCommunes = (
  logements: Logement[]
): Record<string, number> => {
  const placesByCommune = logements.reduce(
    (accumulator: Record<string, number>, currentLogement) => {
      const existingCommune = Object.keys(accumulator).find(
        (commune) => commune === currentLogement.ville
      );

      if (!existingCommune) {
        accumulator[currentLogement.ville] = currentLogement.nbPlaces;
      } else {
        accumulator[currentLogement.ville] += currentLogement.nbPlaces;
      }
      return accumulator;
    },
    {}
  );
  return sortKeysByValue(placesByCommune);
};
