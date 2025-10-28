import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { zFileUploadCategory } from "@/types/file-upload.type";

export const acteAdministratifApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  originalName: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: zFileUploadCategory,
  startDate: optionalFrenchDateToISO(),
  endDate: optionalFrenchDateToISO(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.number().nullish(),
  controleId: z.number().nullish(),
});

export type ActeAdministratifApiType = z.infer<
  typeof acteAdministratifApiSchema
>;
