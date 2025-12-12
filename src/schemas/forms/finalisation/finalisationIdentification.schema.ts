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
  structureTypologiesAutoSaveSchema,
  structureTypologiesSchema,
} from "@/schemas/forms/base/structureTypologie.schema";

export const finalisationIdentificationSchema = identificationSchemaWithContacts
  .and(calendrierSchema)
  .and(adresseAdministrativeSchema)
  .and(structureTypologiesSchema);

export const finalisationIdentificationAutoSaveSchema =
  identificationSchemaWithContactsAutoSaveSchema
    .and(calendrierAutoSaveSchema)
    .and(adresseAdministrativeAutoSaveSchema)
    .and(structureTypologiesAutoSaveSchema);

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;

export type FinalisationIdentificationAutoSaveFormValues = z.infer<
  typeof finalisationIdentificationAutoSaveSchema
>;
