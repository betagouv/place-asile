import z from "zod";

import { adresseAdministrativeSchema } from "@/schemas/base/adresseAdministrative.schema";
import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { identificationSchemaWithContacts } from "@/schemas/base/identification.schema";
import { typePlacesSchema } from "@/schemas/base/typePlaces.schema";

export const finalisationIdentificationSchema = identificationSchemaWithContacts
  .and(calendrierSchema)
  .and(adresseAdministrativeSchema)
  .and(typePlacesSchema);

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;
