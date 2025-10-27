import z from "zod";

import { controlesSchema } from "../base/controles.schema";
import { evaluationsSchema } from "../base/evaluation.schema";

export const finalisationQualiteSchama = controlesSchema.and(evaluationsSchema);

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchama
>;
