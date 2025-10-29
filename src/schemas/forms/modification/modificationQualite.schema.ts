import z from "zod";

import { controlesSchema } from "../base/controles.schema";
import { evaluationsSchema } from "../base/evaluation.schema";

export const modificationQualiteSchema = controlesSchema.and(evaluationsSchema);

export type ModificationQualiteFormValues = z.infer<
  typeof modificationQualiteSchema
>;
