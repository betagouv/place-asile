import { Adresse, Repartition } from "@/types/adresse.type";
import { sortKeysByValue } from "./common.util";
import { Structure } from "@/types/structure.type";
import { Typologie } from "@/types/typologie.type";
import dayjs from "dayjs";
import { Controle } from "@/types/controle.type";
import { Evaluation } from "@/types/evaluation.type";

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
    (repartition) =>
      repartition.toUpperCase() === Repartition.DIFFUS.toUpperCase()
  );
  const isCollectif = repartitions?.some(
    (repartition) =>
      repartition.toUpperCase() === Repartition.COLLECTIF.toUpperCase()
  );
  if (isDiffus && isCollectif) {
    return Repartition.MIXTE;
  } else if (isDiffus) {
    return Repartition.DIFFUS;
  } else {
    return Repartition.COLLECTIF;
  }
};

const getCurrentPlacesByProperty = (
  structure: Structure,
  accessor: keyof Typologie
) => {
  const mostRecentYearTypologies = structure.adresses?.map(
    (adresse) => adresse.typologies?.[0]
  );
  const placesByAccessor = mostRecentYearTypologies?.reduce(
    (totalCount, currentTypologie) =>
      totalCount + ((currentTypologie?.[accessor] as number) || 0),
    0
  );
  return placesByAccessor || 0;
};

export const getCurrentPlacesLgbt = (structure: Structure): number => {
  return getCurrentPlacesByProperty(structure, "lgbt");
};

export const getCurrentPlacesFvvTeh = (structure: Structure): number => {
  return getCurrentPlacesByProperty(structure, "fvvTeh");
};

export const getCurrentPlacesQpv = (structure: Structure): number => {
  return getCurrentPlacesByProperty(structure, "qpv");
};

export const getCurrentPlacesLogementsSociaux = (
  structure: Structure
): number => {
  return getCurrentPlacesByProperty(structure, "logementSocial");
};

export const getLastVisitInMonths = (
  evaluations: Evaluation[],
  controles: Controle[]
): number => {
  let mostRecentVisit = null;
  if (evaluations.length === 0 && controles.length === 0) {
    return 0;
  } else if (evaluations.length === 0) {
    mostRecentVisit = dayjs(controles[0]?.date);
  } else if (controles.length === 0) {
    mostRecentVisit = dayjs(evaluations[0]?.date);
  } else {
    mostRecentVisit = dayjs(evaluations[0]?.date).isBefore(
      dayjs(controles[0]?.date)
    )
      ? dayjs(controles[0]?.date)
      : dayjs(evaluations[0]?.date);
  }
  return dayjs().diff(mostRecentVisit, "month");
};
