import z from "zod";

import { adresseWithPlacesRequired } from "@/schemas/base/adresse.schema";
import { adresseAdministrativeWithTypeBatiSchema } from "@/schemas/base/adresseAdministrative.schema";
import { identificationSchemaWithContacts } from "@/schemas/base/identification.schema";
import { Repartition } from "@/types/adresse.type";

export const modificationDescriptionSchema = identificationSchemaWithContacts
  .and(adresseAdministrativeWithTypeBatiSchema)
  .and(
    z.object({
      adresses: z.array(adresseWithPlacesRequired),
    })
  )
  .refine((data) => {
    return data.adresses.some(
      (adresse) =>
        adresse.adresseTypologies?.[0]?.placesAutorisees !== undefined
    );
  }, "Au moins une adresse doit avoir des places")
  .superRefine((data, ctx) => {
    if (data.typeBati !== Repartition.MIXTE) {
      return;
    }

    data.adresses.forEach((adresse, index) => {
      if (
        adresse.repartition !== Repartition.DIFFUS &&
        adresse.repartition !== Repartition.COLLECTIF
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Type de bâti requis",
          path: ["adresses", index, "repartition"],
        });
      }
    });
  });

export type ModificationDescriptionFormValues = z.infer<
  typeof modificationDescriptionSchema
>;
