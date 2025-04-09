export const formatDate = (date: Date | string | number): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("fr-FR");
};
