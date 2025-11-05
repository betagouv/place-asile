import { z } from "zod";

const preprocessToDecimals = (val: unknown): number | undefined => {
  if (val === "" || val === null || val === undefined) {
    return undefined;
  }

  if (typeof val === "string") {
    const normalizedValue = val.replace(",", ".").replaceAll(" ", "");
    const parsed = Number(normalizedValue);

    if (!isNaN(parsed)) {
      return parsed;
    }
  } else {
    const parsed = Number(val);

    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const zSafeDecimals = () =>
  z.preprocess(preprocessToDecimals, z.number());
