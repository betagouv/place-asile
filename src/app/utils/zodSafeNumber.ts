import { z } from "zod";

const preprocessToNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const parsed = Number(val);
  return isNaN(parsed) ? undefined : parsed;
};

export const zSafeNumber = () => z.preprocess(preprocessToNumber, z.number());
