export const useYearDate = (year: string): string => {
  const parsedYear = Number(year);
  const validYear = !isNaN(parsedYear) ? parsedYear : 0;

  if (validYear === 0) {
    return "01/01/0";
  }

  return new Date(validYear, 0, 1, 13).toLocaleDateString();
};
