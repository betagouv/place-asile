export const useYearRange = ({
  startYear = 2021,
  endYear = new Date().getFullYear(),
  order = "asc",
}: Props = {}): { years: number[] } => {
  const yearsRange = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  const years = order === "asc" ? yearsRange : yearsRange.reverse();

  return { years };
};

type Props = {
  startYear?: number;
  endYear?: number;
  order?: "asc" | "desc";
};
