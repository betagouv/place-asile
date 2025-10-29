import z from "zod";

import {
  adresseAdministrativeAutoSaveSchema,
  adresseAdministrativeSchema,
} from "@/schemas/forms/base/adresseAdministrative.schema";
import {
  calendrierAutoSaveSchema,
  calendrierSchema,
} from "@/schemas/forms/base/calendrier.schema";
import {
  identificationSchemaWithContacts,
  identificationSchemaWithContactsAutoSaveSchema,
} from "@/schemas/forms/base/identification.schema";
import {
  typePlacesWithEvolutionAutoSaveSchema,
  typePlacesWithoutEvolutionSchema,
} from "@/schemas/forms/base/typePlaces.schema";

export const finalisationIdentificationSchema = identificationSchemaWithContacts
  .and(calendrierSchema)
  .and(adresseAdministrativeSchema)
  .and(typePlacesWithoutEvolutionSchema);

export const finalisationIdentificationAutoSaveSchema =
  identificationSchemaWithContactsAutoSaveSchema
    .and(calendrierAutoSaveSchema)
    .and(adresseAdministrativeAutoSaveSchema)
    .and(typePlacesWithEvolutionAutoSaveSchema);

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;

export type FinalisationIdentificationAutoSaveFormValues = z.infer<
  typeof finalisationIdentificationAutoSaveSchema
>;
