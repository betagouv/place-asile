import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

export const evaluationSchema = z.object({
  id: z.number().optional(),
  notePersonne: zSafeNumber().optional(),
  notePro: zSafeNumber().optional(),
  noteStructure: zSafeNumber().optional(),
  note: zSafeNumber().optional(),
  date: optionalFrenchDateToISO(),
  fileUploads: z
    .array(z.object({ key: z.string(), id: z.number().optional() }))
    .optional(),
});

export const evaluationsSchema = z.object({
  evaluations: z.array(evaluationSchema).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type EvaluationsFormValues = z.infer<typeof evaluationsSchema>;
