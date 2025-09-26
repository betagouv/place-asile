import { z } from "zod";

const preprocessToDecimals = (val: unknown): number | undefined => {
  // It must accept a decimal number like 23,50 or 23
  console.log(val);
  if (val === "" || val === null || val === undefined) {
    return undefined;
  }

  // Handle string values with comma as decimal separator
  if (typeof val === "string") {
    // Replace comma with dot for proper number parsing
    const normalizedValue = val.replace(",", ".");
    const parsed = Number(normalizedValue);

    if (!isNaN(parsed)) {
      return parsed;
    }
  } else {
    // Handle direct number values or other formats
    const parsed = Number(val);

    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const zSafeDecimals = () =>
  z.preprocess(preprocessToDecimals, z.number());
