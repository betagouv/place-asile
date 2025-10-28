import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { ActeAdministratifCategory } from "@/types/file-upload.type";

import { fileApiSchema } from "./file.schema";

export const acteAdministratifApiSchema = fileApiSchema.extend({
  date: optionalFrenchDateToISO(),
  category: z.enum(ActeAdministratifCategory),
});

export type ActeAdministratifApiType = z.infer<
  typeof acteAdministratifApiSchema
>;
