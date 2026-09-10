import { getNow } from "@/app/utils/now.util";
import {
  CompletudeReason,
  CompletudeStat,
} from "@/schemas/api/statistique.schema";

import { ACTUALISATION_FORM_SLUG_PREFIX } from "../forms/form.constants";
import type {
  StatistiqueDbFormDefinition,
  StatistiqueDbStructure,
  StatistiqueDbValidatedActualisation,
  StatistiquesCompletudeContext,
} from "./statistiques.db.type";

const OUT_OF_CAMPAGNE_SCOPE: CompletudeStat = {
  isComplete: true,
  reason: null,
  nbAttendues: 0,
  nbRenseignees: 0,
};

export const parseCampagneYear = (
  definition: StatistiqueDbFormDefinition
): number =>
  Number(definition.slug.slice(ACTUALISATION_FORM_SLUG_PREFIX.length));

const getCampagneYears = (
  definitions: StatistiqueDbFormDefinition[]
): number[] =>
  definitions
    .map(parseCampagneYear)
    .filter((year) => Number.isInteger(year))
    .sort((yearA, yearB) => yearA - yearB);

/**
 * Première année sous responsabilité d'une campagne : la campagne N couvre N et
 * l'année précédente. En dessous, la donnée est historique et considérée complète.
 */
const getFirstCampagneYear = (
  definitions: StatistiqueDbFormDefinition[]
): number | null => {
  const campagneYears = getCampagneYears(definitions);
  return campagneYears.length > 0 ? campagneYears[0] - 1 : null;
};

/**
 * Valider une campagne écrit la donnée de toutes les années de son tableau :
 * une année reste donc saisissable tant qu'une campagne postérieure ou égale
 * est ouverte.
 */
const isCampagneOpenForYear = (
  definitions: StatistiqueDbFormDefinition[],
  year: number,
  now: Date
): boolean =>
  definitions.some((definition) => {
    const campagneYear = parseCampagneYear(definition);
    if (!Number.isInteger(campagneYear) || campagneYear < year) {
      return false;
    }
    return definition.deadline === null || definition.deadline >= now;
  });

/** Dernière campagne validée par structure : une seule entrée, l'année la plus récente. */
export const buildLastValidatedCampagneYearByStructureId = (
  validatedActualisations: StatistiqueDbValidatedActualisation[]
): Map<number, number> => {
  const lastValidatedYearByStructureId = new Map<number, number>();

  for (const actualisation of validatedActualisations) {
    if (actualisation.structureId === null) {
      continue;
    }
    const campagneYear = parseCampagneYear(actualisation.formDefinition);
    if (!Number.isInteger(campagneYear)) {
      continue;
    }
    const lastValidatedYear = lastValidatedYearByStructureId.get(
      actualisation.structureId
    );
    if (lastValidatedYear === undefined || campagneYear > lastValidatedYear) {
      lastValidatedYearByStructureId.set(
        actualisation.structureId,
        campagneYear
      );
    }
  }

  return lastValidatedYearByStructureId;
};

/** Structures attendues sur une année : actives sur l'année et initialisées. */
export const resolveExpectedStructureIds = (
  context: StatistiquesCompletudeContext,
  structuresForYear: StatistiqueDbStructure[]
): Set<number> => {
  const expectedStructureIds = new Set<number>();

  for (const structure of structuresForYear) {
    if (context.finalisedStructureIds.has(structure.id)) {
      expectedStructureIds.add(structure.id);
    }
  }

  return expectedStructureIds;
};

/**
 * Complétude d'un millésime : une structure est à jour sur l'année dès qu'elle a
 * validé une campagne d'actualisation postérieure ou égale, le formulaire
 * couvrant l'année de campagne et les années précédentes.
 */
export const computeYearCompletude = (
  context: StatistiquesCompletudeContext,
  year: number,
  expectedStructureIds: Set<number>,
  now: Date = getNow()
): CompletudeStat => {
  const firstCampagneYear = getFirstCampagneYear(
    context.actualisationFormDefinitions
  );
  if (firstCampagneYear === null || year < firstCampagneYear) {
    return { ...OUT_OF_CAMPAGNE_SCOPE };
  }

  const nbAttendues = expectedStructureIds.size;
  let nbRenseignees = 0;
  for (const structureId of expectedStructureIds) {
    const lastValidatedYear =
      context.lastValidatedCampagneYearByStructureId.get(structureId);
    if (lastValidatedYear !== undefined && lastValidatedYear >= year) {
      nbRenseignees += 1;
    }
  }

  if (nbRenseignees >= nbAttendues) {
    return { isComplete: true, reason: null, nbAttendues, nbRenseignees };
  }

  return {
    isComplete: false,
    reason: isCampagneOpenForYear(
      context.actualisationFormDefinitions,
      year,
      now
    )
      ? CompletudeReason.SAISIE_EN_COURS
      : CompletudeReason.SAISIE_INCOMPLETE,
    nbAttendues,
    nbRenseignees,
  };
};
