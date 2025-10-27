import z from "zod";

import {
  optionalFrenchDateToISO,
  zSafeDecimalsNullish,
} from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";

const idSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.number().optional()
);
const fileUploadSchema = z.object({
  key: z.string(),
  id: idSchema,
});
const fileUploadAutoSaveSchema = z.object({
  key: z.string().optional(),
  id: idSchema,
});

const evaluationBaseSchema = z.object({
  id: idSchema,
  date: optionalFrenchDateToISO(),
});

export const evaluationSchema = evaluationBaseSchema.extend({
  notePersonne: zSafeDecimals(),
  notePro: zSafeDecimals(),
  noteStructure: zSafeDecimals(),
  note: zSafeDecimals(),
  fileUploads: z.array(fileUploadSchema).optional(),
});

export const evaluationAutoSaveSchema = evaluationBaseSchema.extend({
  notePersonne: zSafeDecimalsNullish(),
  notePro: zSafeDecimalsNullish(),
  noteStructure: zSafeDecimalsNullish(),
  note: zSafeDecimalsNullish(),
  fileUploads: z.array(fileUploadAutoSaveSchema).optional(),
});

export const evaluationsSchema = z.object({
  evaluations: z.array(evaluationSchema).optional(),
});

export const evaluationsAutoSaveSchema = z.object({
  evaluations: z.array(evaluationAutoSaveSchema).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type EvaluationsFormValues = z.infer<typeof evaluationsSchema>;

export type EvaluationAutoSaveFormValues = z.infer<
  typeof evaluationAutoSaveSchema
>;
export type EvaluationsAutoSaveFormValues = z.infer<
  typeof evaluationsAutoSaveSchema
>;
