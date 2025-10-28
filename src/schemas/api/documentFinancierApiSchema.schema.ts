import z from "zod";

import {
  frenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { zDocumentFinancierCategory } from "@/types/file-upload.type";

export const documentFinancierApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  originalName: z.string().optional(),
  date: frenchDateToISO(),
  category: zDocumentFinancierCategory,
  startDate: optionalFrenchDateToISO(),
  endDate: optionalFrenchDateToISO(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.number().nullish(),
  controleId: z.number().nullish(),
});

export type DocumentFinancierApiType = z.infer<
  typeof documentFinancierApiSchema
>;
