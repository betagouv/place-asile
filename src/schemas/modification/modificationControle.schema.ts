import z from "zod";

import { controleSchema } from "../base/documents.schema";

export const modificationControleSchema = z.object({
  controles: z.array(controleSchema).optional(),
});

export type ModificationControleFormValues = z.infer<
  typeof modificationControleSchema
>;
