import dayjs from "dayjs";

export const useFormatDateString = () => {
  const formatDateString = (
    dateValue: Date | string | null | undefined,
    defaultValue: string = ""
  ): string => {
    if (!dateValue) {
      return defaultValue;
    }
    const date = dayjs(dateValue);
    return date.isValid() ? date.format("DD/MM/YYYY") : defaultValue;
  };

  return { formatDateString };
};
