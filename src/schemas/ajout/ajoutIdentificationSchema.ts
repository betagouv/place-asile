import z from "zod";

import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { identificationSchema } from "@/schemas/base/identification.schema";

export const ajoutIdentificationSchema =
  identificationSchema.and(calendrierSchema);

export type AjoutIdentificationFormValues = z.infer<
  typeof ajoutIdentificationSchema
>;
