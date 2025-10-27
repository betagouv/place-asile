import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

export const evaluationSchema = z.object({
  id: z.union([z.string().nullish(), zSafeNumber().nullish()]),
  notePersonne: zSafeNumber().nullish(),
  notePro: zSafeNumber().nullish(),
  noteStructure: zSafeNumber().nullish(),
  note: zSafeNumber().nullish(),
  date: createDateFieldValidator().nullish(),
  fileUploads: z.array(z.object({ key: z.string().optional() })).optional(),
});

export const evaluationsSchema = z.object({
  evaluations: z.array(evaluationSchema).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type EvaluationsFormValues = z.infer<typeof evaluationsSchema>;
