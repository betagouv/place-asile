import { Repartition } from "@/types/adresse.type";
import z from "zod";

const adresseSchema = z.object({
  adresseComplete: z.string().nonempty(),
  adresse: z.string().nonempty(),
  codePostal: z.string().nonempty(),
  commune: z.string().nonempty(),
  repartition: z.nativeEnum(Repartition),
  places: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0)
    )
    .optional(),
  typologies: z.array(z.any()).optional(),
  qpv: z.boolean().optional(),
  logementSocial: z.boolean().optional(),
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
        // Check if this address has a non-empty adresseComplete but empty places

        if (
          adresse.adresseComplete &&
          adresse.adresseComplete.trim() !== "" &&
          (adresse.places === undefined || adresse.places === null)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Requis",
            path: ["places"],
          });
        }
      })
    ),
  })
  .refine((data) => {
    return data.adresses.some((adresse) => adresse.places !== undefined);
  }, "Au moins une adresse doit avoir des places")
  .superRefine((data, ctx) => {
    if (data.typeBati !== Repartition.MIXTE) {
      return;
    }

    // When typeBati is MIXTE, check each address and add specific errors
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
