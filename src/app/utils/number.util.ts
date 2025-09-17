/**
 * Formats a number as French currency (EUR)
 * @param value - The number to format
 * @returns Formatted currency string (e.g., "1 234,56 €")
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0,00 €";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Formats a number for display in French locale (without currency symbol)
 * @param value - The number to format
 * @returns Formatted number string (e.g., "1 234,56")
 */
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  return new Intl.NumberFormat("fr-FR").format(value);
};

/**
 * Parses a French-formatted number string back to a number
 * Handles both "1 234,56" and "1234.56" formats
 * @param value - The formatted string to parse
 * @returns The parsed number or null if invalid
 */
export const parseFrenchNumber = (value: string): number | null => {
  if (!value || typeof value !== "string") {
    return null;
  }

  // Remove currency symbols and extra spaces
  let cleaned = value.replace(/[€\s]/g, "");

  // Handle French format (comma as decimal separator, space as thousands separator)
  if (cleaned.includes(",")) {
    // Replace spaces (thousands separator) and convert comma to dot
    cleaned = cleaned.replace(/\s/g, "").replace(",", ".");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Formats a number for input display (French format without currency)
 * @param value - The number to format for input
 * @returns Formatted string for input field
 */
export const formatForInput = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  // For inputs, we use French number format but without thousands separators
  // to avoid confusion in input fields
  return value.toString().replace(".", ",");
};
