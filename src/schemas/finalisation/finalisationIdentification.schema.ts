import z from "zod";

import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { identificationSchema } from "@/schemas/base/identification.schema";

export const finalisationIdentificationSchema =
  identificationSchema.and(calendrierSchema);

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;
