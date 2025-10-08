import z from "zod";

import { contactSchema } from "@/app/(password-protected)/ajout-structure/validation/contactSchema";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Repartition } from "@/types/adresse.type";
import { PublicType, StructureType } from "@/types/structure.type";

const adresseSchema = z.object({
  id: z.number().optional(),
  adresseComplete: z.string().optional(),
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

export const modificationDescriptionSchema = z
  .object({
    // Champs de description de base (utilisés par FieldSetDescription)
    dnaCode: z.string().min(1),
    operateur: z.object({
      id: z.number(),
      name: z.string(),
    }),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType)
    ),
    creationDate: z.string().min(1),
    finessCode: z.string().optional().or(z.literal("")),
    public: z.nativeEnum(PublicType),
    filiale: z.string().optional(),
    cpom: z.boolean(),
    lgbt: z.boolean(),
    fvvTeh: z.boolean(),

    // Champs de contacts (utilisés par FieldSetContacts)
    contacts: z.array(z.union([contactSchema, contactSchema.optional()])),

    // Champs d'adresse administrative (utilisés par FieldSetAdresseAdministrative)
    nom: z.string().optional(),
    adresseAdministrativeComplete: z.string().min(1),
    adresseAdministrative: z.string().min(1),
    codePostalAdministratif: z.string().min(1),
    communeAdministrative: z.string().min(1),
    departementAdministratif: z.string().min(1),
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
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.finessCode || data.finessCode === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Le code FINESS est obligatoire pour les structures autorisées",
      path: ["finessCode"],
    }
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
