import z from "zod";

import { zSafeYear } from "@/app/utils/zodCustomFields";

export const structureMillesimeApiSchema = z.object({
  id: z.number().optional(),
  year: zSafeYear(),
  cpom: z.boolean(),
  operateurComment: z.string().nullish(),
});

export type StructureMillesimeApiType = z.infer<
  typeof structureMillesimeApiSchema
>;
