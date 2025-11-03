import { z } from "zod";

import { ControleType } from "@/types/controle.type";

import { acteAdministratifApiSchema } from "./acteAdministratif.schema";

export const controleApiSchema = z.object({
  id: z.number().optional(),
  structureId: z.number().optional(),
  date: z.string().datetime().optional(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploadKey: z.string().optional(),
  fileUploads: z.array(acteAdministratifApiSchema).optional(),
});

export type ControleApiType = z.infer<typeof controleApiSchema>;
