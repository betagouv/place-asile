import { z } from "zod";

import { ControleType } from "@/types/controle.type";

import { fileUploadApiSchema } from "./fileUpload.schema";

export const controleApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  date: z.string().datetime().optional(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploadKey: z.string().optional(),
  fileUploads: z.array(fileUploadApiSchema).optional(),
});

export type ControleApiType = z.infer<typeof controleApiSchema>;
