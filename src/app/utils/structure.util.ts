import { Adresse, Repartition } from "@/types/adresse.type";
import { sortKeysByValue } from "./common.util";
import { Structure } from "@/types/structure.type";

export const getPlacesByCommunes = (
  adresses: Adresse[]
): Record<string, number> => {
  const placesByCommune: Record<string, number> = {};
  for (const adresse of adresses) {
    const existingCommune = Object.keys(placesByCommune).find(
      (commune) => commune === adresse.commune
    );

    if (!existingCommune) {
      placesByCommune[adresse.commune] =
        adresse.typologies?.[0]?.nbPlacesTotal || 0;
    } else {
      placesByCommune[adresse.commune] +=
        adresse.typologies?.[0]?.nbPlacesTotal || 0;
    }
  }

  return sortKeysByValue(placesByCommune);
};

export const getRepartition = (structure: Structure): Repartition => {
  const repartitions = structure.adresses?.map(
    (adresse) => adresse.repartition
  );
  const isDiffus = repartitions?.some(
    (repartition) => repartition === Repartition.DIFFUS
  );
  const isCollectif = repartitions?.some(
    (repartition) => repartition === Repartition.COLLECTIF
  );
  if (isDiffus && isCollectif) {
    return Repartition.MIXTE;
  } else if (isDiffus) {
    return Repartition.DIFFUS;
  } else {
    return Repartition.COLLECTIF;
  }
};
