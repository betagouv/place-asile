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

// 1er janvier à 12:00:00 UTC depuis une année
// Utilise UTC pour éviter les problèmes de fuseau horaire
export const buildYearStartDate = (year: number, hour: number = 12): Date => {
  return new Date(Date.UTC(year, 0, 1, hour, 0, 0, 0));
};

// Normalize with the exception of the 31/12 at 23:00:00 (due to GMT issue)
export const normalizeYearDate = (date: Date): Date => {
  if (
    date.getMonth() === 11 && // december (index starts at 0 for months...)
    date.getDate() === 31 &&
    date.getHours() === 23 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0
  ) {
    const year = date.getFullYear();
    return buildYearStartDate(year + 1);
  }
  const year = date.getFullYear();
  return buildYearStartDate(year);
};
