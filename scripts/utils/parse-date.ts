export const parseDate = (value: string, context: string): Date => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${context}: valeur vide`);
  }

  if (trimmed.length === 4) {
    return new Date(Number(trimmed), 0, 1, 12, 0, 0);
  }

  const isoCandidate = new Date(trimmed);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  throw new Error(`${context}: format de date invalide (${value})`);
};

/**
 * Génère une date pour le début d'une année donnée à 13h (pour éviter les problèmes de timezone)
 * Utilise la même logique que parseDate mais avec 13h au lieu de 12h
 */
export const buildYearStartDate = (year: number, hour: number = 13): Date => {
  return new Date(year, 0, 1, hour, 0, 0, 0);
};
