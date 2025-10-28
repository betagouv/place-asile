import z from "zod";

import { controlesSchema } from "../base/controles.schema";
import {
  evaluationsAutoSaveSchema,
  evaluationsSchema,
} from "../base/evaluation.schema";
import { placesEvolutionSchema } from "../base/typePlaces.schema";

export const finalisationQualiteSchema = controlesSchema
  .and(evaluationsSchema)
  .and(placesEvolutionSchema);

export const finalisationQualiteAutoSaveSchema = controlesSchema
  .and(evaluationsAutoSaveSchema)
  .and(placesEvolutionSchema);

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchema
>;

export type FinalisationQualiteAutoSaveFormValues = z.infer<
  typeof finalisationQualiteAutoSaveSchema
>;
