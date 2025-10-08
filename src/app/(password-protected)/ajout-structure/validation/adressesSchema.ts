import z from "zod";

import { adresseSchema } from "@/schemas/adresse.schema";
import { Repartition } from "@/types/adresse.type";

export type AdressesFormValues = z.infer<typeof AdressesSchema>;

export const AdressesSchema = z
  .object({
    nom: z.string().optional(),
    adresseAdministrativeComplete: z.string().min(3),
    adresseAdministrative: z.string().nonempty(),
    codePostalAdministratif: z.string().nonempty(),
    communeAdministrative: z.string().nonempty(),
    departementAdministratif: z.string().nonempty(),
    typeBati: z.nativeEnum(Repartition),
    sameAddress: z.boolean().optional(),
    adresses: z.array(
      adresseSchema.superRefine((adresse, ctx) => {
        if (
          adresse.adresseComplete &&
          adresse.adresseComplete.trim() !== "" &&
          (adresse.adresseTypologies?.[0]?.placesAutorisees === undefined ||
            adresse.adresseTypologies?.[0]?.placesAutorisees === null ||
            adresse.adresseTypologies?.[0]?.placesAutorisees === 0)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Requis",
            path: ["placesAutorisees"],
          });
        }
      })
    ),
  })
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
