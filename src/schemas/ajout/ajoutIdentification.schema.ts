import z from "zod";

import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { identificationSchema } from "@/schemas/base/identification.schema";

import { contactSchema } from "../base/contact.schema";

export const ajoutIdentificationSchema = identificationSchema
  .and(calendrierSchema)
  .and(
    z.object({
      contactPrincipal: contactSchema,
      contactSecondaire: contactSchema.optional(),
    })
  );

export type AjoutIdentificationFormValues = z.infer<
  typeof ajoutIdentificationSchema
>;
