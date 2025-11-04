import z from "zod";

import { controlesAutoSaveSchema } from "../base/controle.schema";
import {
  evaluationsAutoSaveSchema,
  evaluationsSchema,
} from "../base/evaluation.schema";
import {
  placesEvolutionAutoSaveSchema,
  placesEvolutionSchema,
} from "../base/typePlaces.schema";

export const finalisationQualiteSchema = controlesAutoSaveSchema
  .and(evaluationsSchema)
  .and(placesEvolutionSchema);

export const finalisationQualiteAutoSaveSchema = controlesAutoSaveSchema
  .and(evaluationsAutoSaveSchema)
  .and(placesEvolutionAutoSaveSchema);

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchema
>;

export type FinalisationQualiteAutoSaveFormValues = z.infer<
  typeof finalisationQualiteAutoSaveSchema
>;
