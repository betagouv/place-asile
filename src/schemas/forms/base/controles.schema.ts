import z from "zod";

import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { ControleType } from "@/types/controle.type";

export const controleSchema = z.object({
  id: zSafeNumber().nullish(),
  date: z.string().datetime().optional(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploads: z.array(z.object({ key: z.string().optional() })).optional(),
});

export const controlesSchema = z.object({
  controles: z.array(controleSchema).optional(),
});

export type ControleFormValues = z.infer<typeof controleSchema>;

export type ControlesFormValues = z.infer<typeof controlesSchema>;
