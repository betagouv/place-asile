import z from "zod";

import { frDateField } from "@/app/api/structures/structure.util";
import { zFileUploadCategory } from "@/types/file-upload.type";

export const fileUploadApiSchema = z.object({
  id: z.number().optional(),
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  date: frDateField(),
  category: zFileUploadCategory,
  startDate: frDateField(),
  endDate: frDateField(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.number().nullish(),
  controleId: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type FileUploadApiType = z.infer<typeof fileUploadApiSchema>;
