import { z } from "zod";

import { frDateField } from "@/app/api/structures/structure.util";
import { ControleType } from "@/types/controle.type";

export const controleApiSchema = z.object({
  id: z.number().optional(),
  date: frDateField(),
  type: z.nativeEnum(ControleType),
  fileUploadKey: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ControleApiType = z.infer<typeof controleApiSchema>;
