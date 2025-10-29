import z from "zod";

import {
  frenchDateToISO,
  zSafeDecimalsNullish,
} from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";

export const controleSchema = z.object({
  id: zSafeDecimalsNullish(),
  date: frenchDateToISO(),
  type: z.nativeEnum(ControleType),
  fileUploads: z
    .array(z.object({ key: z.string(), id: zSafeDecimalsNullish() }).optional())
    .optional(),
});

export const controlesSchema = z.object({
  controles: z.array(controleSchema).optional(),
});

export type ControleFormValues = z.infer<typeof controleSchema>;

export type ControlesFormValues = z.infer<typeof controlesSchema>;
