import z from "zod";

import { controlesSchema } from "../base/controles.schema";
import {
  evaluationsAutoSaveSchema,
  evaluationsSchema,
} from "../base/evaluation.schema";

export const finalisationQualiteSchema = controlesSchema.and(evaluationsSchema);

export const finalisationQualiteAutoSaveSchema = controlesSchema.and(
  evaluationsAutoSaveSchema
);

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchema
>;

export type FinalisationQualiteAutoSaveFormValues = z.infer<
  typeof finalisationQualiteAutoSaveSchema
>;
