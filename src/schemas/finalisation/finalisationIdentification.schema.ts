import z from "zod";

import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { identificationSchemaWithContacts } from "@/schemas/base/identification.schema";

export const finalisationIdentificationSchema =
  identificationSchemaWithContacts.and(calendrierSchema);

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;
