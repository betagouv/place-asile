import { z } from "zod";

// Prétraitement
const preprocessToNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const parsed = Number(val);
  return isNaN(parsed) ? undefined : parsed;
};

// Factory retournant un ZodEffects<ZodNumber> sur lequel tu peux encore chaîner
export const zSafeNumber = () => z.preprocess(preprocessToNumber, z.number());
