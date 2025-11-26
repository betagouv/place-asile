export const parseDate = (value: string, context: string): Date => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${context}: valeur vide`);
  }

  if (trimmed.length === 4) {
    return new Date(Number(trimmed), 0, 1);
  }

  const isoCandidate = new Date(trimmed);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  throw new Error(`${context}: format de date invalide (${value})`);
};
