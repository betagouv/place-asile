import "dayjs/locale/fr";

import dayjs from "dayjs";

dayjs.locale("fr");

export const formatDate = (date: Date | string | number): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("fr-FR");
};

export const formatDateString = (
  dateValue: Date | string | null | undefined,
  defaultValue: string = ""
): string => {
  if (!dateValue) {
    return defaultValue;
  }
  const date = dayjs(dateValue);
  return date.isValid() ? date.format("DD/MM/YYYY") : defaultValue;
};

export const formatDateToIsoString = (
  date: string | undefined,
  defaultToToday: boolean = false
): string | null => {
  if (date) {
    return dayjs(date, "DD/MM/YYYY").toISOString();
  }
  if (defaultToToday) {
    return dayjs().toISOString();
  }
  return null;
};

export const getMonthsBetween = (
  startDate?: string | null,
  endDate?: string | null
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
  return new Date(Number(year), 0, 1, 13).toLocaleDateString("fr-FR");
};

export const parseFrDate = (value: unknown): Date | unknown => {
  if (typeof value === "string") {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, dd, mm, yyyy] = match;
      const isoString = `${yyyy}-${mm}-${dd}`;
      const date = new Date(isoString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  return value;
};

export const getDateStringToYear = (date?: string) => {
  if (!date) return "";
  const dateToConvert = date;
  const parsedDate = new Date(dateToConvert!);
  return parsedDate.getFullYear().toString();
};

export const getYearRange = ({
  startYear = 2021,
  endYear = new Date().getFullYear(),
  order = "asc",
}: {
  startYear?: number;
  endYear?: number;
  order?: "asc" | "desc";
} = {}): { years: number[] } => {
  const yearsRange = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  const years = order === "asc" ? yearsRange : yearsRange.reverse();

  return { years };
};
