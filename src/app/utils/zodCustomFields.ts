import { z } from "zod";

// Regex pattern for DD/MM/YYYY format validation
const DATE_FORMAT_REGEX = /^([0-9]{1,2})[/]([0-9]{1,2})[/]([0-9]{4})$/;

const createRequiredDateValidator = () => {
  return z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseDateString(val);
      }
      return undefined;
    },
    z
      .string()
      .refine((val) => {
        const trimmedVal = typeof val === "string" ? val.trim() : val;
        return DATE_FORMAT_REGEX.test(trimmedVal);
      }, "Format de date invalide (JJ/MM/AAAA)")
      .refine((val) => !!val, "Ce champ est obligatoire")
  );
};

export const createOptionalDateValidator = () => {
  return z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === "") {
        return undefined;
      }

      if (typeof val === "string") {
        const parsed = parseDateString(val);
        if (!parsed || !DATE_FORMAT_REGEX.test(parsed)) {
          return undefined;
        }
        return parsed;
      }

      return undefined;
    })
    .refine(
      (val) => {
        if (val === undefined) return true;

        return DATE_FORMAT_REGEX.test(val);
      },
      { message: "Format de date invalide (JJ/MM/AAAA)" }
    );
};

export const createNullableDateValidator = () => {
  return z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') {
        return null
      };
      return val;
    },
    z.coerce.date().nullable()
  );
}

export const createDateFieldValidator = Object.assign(
  () => createRequiredDateValidator(),
  {
    optional: () => createOptionalDateValidator(),
  }
);

export const parseDateString = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  const trimmedDate = dateString.trim();

  if (DATE_FORMAT_REGEX.test(trimmedDate)) {
    const parts = trimmedDate.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isValidDate(day, month, year)) {
      return formatDate(day, month, year);
    }
  }

  try {
    // Handle YYYY-MM-DD format
    const simpleDateParts = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (simpleDateParts) {
      const year = parseInt(simpleDateParts[1], 10);
      const month = parseInt(simpleDateParts[2], 10);
      const day = parseInt(simpleDateParts[3], 10);

      if (isValidDate(day, month, year)) {
        return formatDate(day, month, year);
      }
    }

    // Handle ISO format dates like "2014-04-19T22:00:00.000Z"
    const isoDateParts = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T/);
    if (isoDateParts) {
      const year = parseInt(isoDateParts[1], 10);
      const month = parseInt(isoDateParts[2], 10);
      const day = parseInt(isoDateParts[3], 10);

      if (isValidDate(day, month, year)) {
        return formatDate(day, month, year);
      }
    }

    // Try parsing as a JavaScript Date object (handles various formats including ISO)
    const dateObj = new Date(trimmedDate);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
      const year = dateObj.getFullYear();

      if (isValidDate(day, month, year)) {
        return formatDate(day, month, year);
      }
    }
  } catch {}

  return undefined;
};

function isValidDate(day: number, month: number, year: number): boolean {
  if (
    day >= 1 &&
    day <= 31 &&
    month >= 1 &&
    month <= 12 &&
    year >= 1900 &&
    year <= 2100
  ) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  }
  return false;
}

function formatDate(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(
    2,
    "0"
  )}/${year}`;
}
