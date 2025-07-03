export const useDateStringToYear = (
  dateValue?: string
): { dateStringToYear: (date?: string) => string } => {
  const dateStringToYear = (date?: string) => {
    if (!date && !dateValue) return "";
    const dateToConvert = date || dateValue;
    const parsedDate = new Date(dateToConvert!);
    return parsedDate.getFullYear().toString();
  };
  return { dateStringToYear };
};
