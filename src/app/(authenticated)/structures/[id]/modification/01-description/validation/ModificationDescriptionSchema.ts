import z from "zod";

import { contactSchema } from "@/app/(password-protected)/ajout-structure/validation/contactSchema";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Repartition } from "@/types/adresse.type";
import { PublicType, StructureType } from "@/types/structure.type";

export const modificationDescriptionSchema = z
  .object({
    // Champs de description de base (utilisés par FieldSetDescription)
    dnaCode: z.string().nonempty(),
    operateur: z.object({
      id: z.number(),
      name: z.string(),
    }),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType)
    ),
    creationDate: z.string().nonempty(),
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
    adresseAdministrativeComplete: z.string().nonempty(),
    adresseAdministrative: z.string().nonempty(),
    codePostalAdministratif: z.string().nonempty(),
    communeAdministrative: z.string().nonempty(),
    departementAdministratif: z.string().nonempty(),
    typeBati: z.nativeEnum(Repartition),
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
  );

export type ModificationDescriptionFormValues = z.infer<
  typeof modificationDescriptionSchema
>;
