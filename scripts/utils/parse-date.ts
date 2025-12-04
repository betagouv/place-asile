export const parseDate = (value: string, context: string): Date => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${context}: valeur vide`);
  }

  if (trimmed.length === 4) {
    return buildYearStartDate(Number(trimmed));
  }

  const isoCandidate = new Date(trimmed);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  throw new Error(`${context}: format de date invalide (${value})`);
};

// 1er janvier à 12:00:00 depuis une année
export const buildYearStartDate = (year: number): Date =>
  new Date(year, 0, 1, 12, 0, 0);
