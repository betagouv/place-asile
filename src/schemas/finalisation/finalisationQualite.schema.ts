import z from "zod";

import { controleSchema, fileUploadSchema } from "../base/documents.schema";

export const finalisationQualiteSchema = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
  controles: z.array(controleSchema).optional(),
});

export type FinalisationQualiteFormValues = z.infer<
  typeof finalisationQualiteSchema
>;
