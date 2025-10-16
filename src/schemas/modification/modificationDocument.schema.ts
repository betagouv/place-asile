import z from "zod";

import { fileUploadSchema } from "../base/documents.schema";

export const modificationDocumentSchema = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
});

export type ModificationDocumentFormValues = z.infer<
  typeof modificationDocumentSchema
>;
