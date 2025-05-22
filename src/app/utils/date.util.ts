import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

export const formatDate = (date: Date | string | number): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("fr-FR");
};

export const getMonthsBetween = (
  startDate: Date | string | null,
  endDate: Date | string | null
): dayjs.Dayjs[] => {
  const start = dayjs(startDate).startOf("month");
  const end = dayjs(endDate).startOf("month");

  if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
    return [];
  }

  const diffInMonths = end.diff(start, "month") + 1;

  return Array.from({ length: diffInMonths }, (_, index) => {
    return start.add(index, "month");
  });
};

export const getLastMonths = (numberOfMonths: number): dayjs.Dayjs[] => {
  return Array.from({ length: numberOfMonths }, (_, index) => {
    return dayjs().subtract(index, "month");
  }).reverse();
};

export const formatForCharts = (date: dayjs.Dayjs): string => {
  return date.format("MMM YYYY").toUpperCase();
};

export const getYearDate = (year: string): string => {
  return new Date(Number(year), 0, 1, 13).toLocaleDateString();
};
