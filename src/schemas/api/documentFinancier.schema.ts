import z from "zod";

import { frenchDateToISO } from "@/app/utils/zodCustomFields";
import { DocumentFinancierCategory } from "@/types/file-upload.type";

import { fileApiSchema } from "./file.schema";

export const documentFinancierApiSchema = fileApiSchema.extend({
  date: frenchDateToISO(),
  category: z.enum(DocumentFinancierCategory),
});

export type DocumentFinancierApiType = z.infer<
  typeof documentFinancierApiSchema
>;
