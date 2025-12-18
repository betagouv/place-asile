import dayjs from "dayjs";

import { CURRENT_YEAR } from "@/constants";
import {
  AdresseApiType,
  AdresseTypologieApiType,
} from "@/schemas/api/adresse.schema";
import { ControleApiType } from "@/schemas/api/controle.schema";
import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import {
  StructureAgentUpdateApiType,
  StructureApiType,
} from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

import { sortKeysByValue } from "./common.util";

export const getPlacesByCommunes = (
  adresses: AdresseApiType[]
): Record<string, number> => {
  const placesByCommune: Record<string, number> = {};
  for (const adresse of adresses) {
    const existingCommune = Object.keys(placesByCommune).find(
      (commune) => commune === adresse.commune
    );

    if (!existingCommune) {
      placesByCommune[adresse.commune ?? ""] =
        adresse.adresseTypologies?.[0]?.placesAutorisees || 0;
    } else {
      placesByCommune[adresse.commune ?? ""] +=
        adresse.adresseTypologies?.[0]?.placesAutorisees || 0;
    }
  }

  return sortKeysByValue(placesByCommune);
};

export const getRepartition = (
  structure: StructureAgentUpdateApiType | StructureApiType
): Repartition => {
  const repartitions = structure.adresses?.map(
    (adresse) => adresse.repartition
  );

  const isDiffus = repartitions?.some(
    (repartition) =>
      repartition?.toUpperCase() === Repartition.DIFFUS.toUpperCase()
  );
  const isCollectif = repartitions?.some(
    (repartition) =>
      repartition?.toUpperCase() === Repartition.COLLECTIF.toUpperCase()
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
  structure: StructureApiType,
  accessor: keyof AdresseTypologieApiType
) => {
  const mostRecentYearTypologies = structure.adresses?.map(
    (adresse) => adresse.adresseTypologies?.[0]
  );
  const placesByAccessor = mostRecentYearTypologies?.reduce(
    (totalCount, currentTypologie) =>
      totalCount + ((currentTypologie?.[accessor] as number) || 0),
    0
  );
  return placesByAccessor || 0;
};

export const getCurrentPlacesAutorisees = (
  structure: StructureApiType
): number => {
  return getCurrentPlacesByProperty(structure, "placesAutorisees");
};

export const getCurrentPlacesQpv = (structure: StructureApiType): number => {
  return getCurrentPlacesByProperty(structure, "qpv");
};

export const getCurrentPlacesLogementsSociaux = (
  structure: StructureApiType
): number => {
  return getCurrentPlacesByProperty(structure, "logementSocial");
};

export const getLastVisitInMonths = (
  evaluations: EvaluationApiType[],
  controles: ControleApiType[]
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

export const isStructureAutorisee = (type: string | undefined): boolean => {
  return type === StructureType.CADA || type === StructureType.CPH;
};

export const isStructureSubventionnee = (type: string | undefined): boolean => {
  return type === StructureType.HUDA || type === StructureType.CAES;
};

export const getOperateurLabel = (
  filiale: string | null | undefined,
  operateur: string | null | undefined
): string | null | undefined => {
  return filiale ? `${filiale} (${operateur})` : operateur;
};

export const isStructureInCpom = (structure: StructureApiType): boolean => {
  return (
    structure.structureMillesimes?.find(
      (millesime) => millesime.year === CURRENT_YEAR
    )?.cpom ?? false
  );
};

export const getCurrentCpomStructureDates = (
  structure: StructureApiType
): { debutCpom?: string; finCpom?: string } => {
  const now = new Date().toISOString();
  const currentCpomStructure = structure.cpomStructures?.find(
    (cpomStructure) => {
      const dateDebut = cpomStructure.dateDebut ?? cpomStructure.cpom.debutCpom;
      const dateFin = cpomStructure.dateFin ?? cpomStructure.cpom.finCpom;

      if (!dateDebut || !dateFin) {
        return false;
      }

      return dateDebut <= now && dateFin >= now;
    }
  );

  if (!currentCpomStructure) {
    return {};
  }

  const currentCpomStructureDateDebut =
    currentCpomStructure.dateDebut ?? currentCpomStructure.cpom.debutCpom;
  const currentCpomStructureDateFin =
    currentCpomStructure.dateFin ?? currentCpomStructure.cpom.finCpom;

  return {
    debutCpom: currentCpomStructureDateDebut,
    finCpom: currentCpomStructureDateFin,
  };
};

export const getCurrentStructureTypology = (
  structure: StructureAgentUpdateApiType | StructureApiType
): StructureTypologieApiType => {
  const currentYearStructureTypology = structure.structureTypologies?.find(
    (structureTypologie) => structureTypologie.year === CURRENT_YEAR
  );

  return currentYearStructureTypology as StructureTypologieApiType;
};
