/**
 * Formats a date to the French format (DD/MM/YYYY)
 * @param date - Date object or string that can be parsed into a Date
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (date: Date | string | number): string => {
  if (!date) return "";
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("fr-FR");
};
