import z from "zod";

import { controlesSchema } from "../base/controles.schema";
import { evaluationsSchema } from "../base/evaluation.schema";
import { placesEvolutionSchema } from "../base/typePlaces.schema";

export const finalisationQualiteSchama = controlesSchema
  .and(evaluationsSchema)
  .and(placesEvolutionSchema);

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchama
>;
