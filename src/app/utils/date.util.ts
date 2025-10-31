import "dayjs/locale/fr";

import dayjs from "dayjs";

dayjs.locale("fr");

export const formatDate = (date: Date | string | number): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleDateString("fr-FR");
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

export const getElapsedPercentage = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): number => {
  const now = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (now.isBefore(start)) {
    return 0;
  }
  if (now.isAfter(end)) {
    return 100;
  }

  const total = end.diff(start, "millisecond");
  const elapsed = now.diff(start, "millisecond");

  if (total === 0) {
    return 100;
  }

  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};
