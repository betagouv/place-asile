import z from "zod";

import { zFileUploadCategory } from "@/types/file-upload.type";

export const fileUploadApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  originalName: z.string().optional(),
  date: z.string().datetime(),
  category: zFileUploadCategory,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.number().nullish(),
  controleId: z.number().nullish(),
});

export type FileUploadApiType = z.infer<typeof fileUploadApiSchema>;
