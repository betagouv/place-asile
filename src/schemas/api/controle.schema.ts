import { z } from "zod";

import { ControleType } from "@/types/controle.type";

import { fileUploadApiSchema } from "./fileUpload.schema";

export const controleApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  date: z.string().datetime(),
  type: z.nativeEnum(ControleType),
  fileUploadKey: z.string().optional(),
  fileUploads: z.array(fileUploadApiSchema).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ControleApiType = z.infer<typeof controleApiSchema>;
