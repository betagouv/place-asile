import z from "zod";

import { frenchDateToISO } from "@/app/utils/zodCustomFields";
import { zFileUploadCategory } from "@/types/file-upload.type";

export const fileUploadApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  originalName: z.string().optional(),
  date: frenchDateToISO(),
  category: zFileUploadCategory,
  startDate: frenchDateToISO().optional(),
  endDate: frenchDateToISO().optional(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.number().nullish(),
  controleId: z.number().nullish(),
});

export type FileUploadApiType = z.infer<typeof fileUploadApiSchema>;
