import { z } from "zod";

// Regex pattern for DD/MM/YYYY format validation
const DATE_FORMAT_REGEX = /^([0-9]{1,2})[/]([0-9]{1,2})[/]([0-9]{4})$/;

export const createDateFieldValidator = () => {
  return z.preprocess(
    (val) => {
      if (typeof val === "string") {
        // parseDateString already validates and formats the date
        return parseDateString(val);
      }
      return undefined;
    },
    z
      .string()
      .refine((val) => {
        // Check if the value is a valid date in DD/MM/YYYY format
        const trimmedVal = typeof val === "string" ? val.trim() : val;
        return DATE_FORMAT_REGEX.test(trimmedVal);
      }, "Format de date invalide (JJ/MM/AAAA)")
      .refine((val) => !!val, "Ce champ est obligatoire")
  );
};

/**
 * Parses and validates a date string, converting it to DD/MM/YYYY format if valid
 */
export const parseDateString = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  // Trim any whitespace that might be causing issues
  const trimmedDate = dateString.trim();

  // Try with DD/MM/YYYY format first
  if (DATE_FORMAT_REGEX.test(trimmedDate)) {
    const parts = trimmedDate.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Validate date parts and check days in month
    if (isValidDate(day, month, year)) {
      return formatDate(day, month, year);
    }
  }

  // Try with YYYY-MM-DD format
  try {
    const parts = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (parts) {
      const year = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10);
      const day = parseInt(parts[3], 10);

      if (isValidDate(day, month, year)) {
        return formatDate(day, month, year);
      }
    }
  } catch {
    // Silently handle parsing errors
  }

  return undefined;
};

/**
 * Checks if the date components form a valid date
 */
function isValidDate(day: number, month: number, year: number): boolean {
  if (
    day >= 1 &&
    day <= 31 &&
    month >= 1 &&
    month <= 12 &&
    year >= 1900 &&
    year <= 2100
  ) {
    // Check days in month (handles leap years)
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  }
  return false;
}

/**
 * Formats date components to DD/MM/YYYY format with leading zeros
 */
function formatDate(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(
    2,
    "0"
  )}/${year}`;
}
