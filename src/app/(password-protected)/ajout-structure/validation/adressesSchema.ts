import z from "zod";

import { Repartition } from "@/types/adresse.type";

const adresseSchema = z.object({
  id: z.number().optional(),
  adresseComplete: z.string().min(1),
  adresse: z.string().min(1),
  codePostal: z.string().min(1),
  commune: z.string().min(1),
  repartition: z.nativeEnum(Repartition),
  adresseTypologies: z
    .array(
      z.object({
        placesAutorisees: z
          .preprocess(
            (val) => (val === "" ? undefined : Number(val)),
            z.number().min(0)
          )
          .optional(),
        qpv: z.boolean().optional(),
        logementSocial: z.boolean().optional(),
      })
    )
    .optional(),
});

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
