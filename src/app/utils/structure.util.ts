import { sortKeysByValue } from "./common.util";
import { Logement } from "@prisma/client";

export const getPlacesByCommunes = (
  logements: Logement[]
): Record<string, number> => {
  const placesByCommune = logements.reduce(
    (accumulator: Record<string, number>, currentLogement) => {
      const existingCommune = Object.keys(accumulator).find(
        (commune) => commune === currentLogement.ville
      );

      if (!existingCommune) {
        accumulator[currentLogement.ville] = 1;
      } else {
        accumulator[currentLogement.ville] += 1;
      }
      return accumulator;
    },
    {}
  );
  return sortKeysByValue(placesByCommune);
};
