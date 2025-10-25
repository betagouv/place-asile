import z from "zod";

import { isStructureAutorisee } from "@/app/utils/structure.util";
import { contactSchema } from "@/schemas/forms/base/contact.schema";
import { PublicType } from "@/types/structure.type";

import { structureBaseSchema } from "./structure.base.schema";

const baseIdentificationSchema = structureBaseSchema.extend({
  operateur: z.object({
    id: z.number().optional(),
    name: z.string(),
  }),
  creationDate: z.string().min(1),
  finessCode: z.string().optional().or(z.literal("")),
  public: z.nativeEnum(PublicType),
  filiale: z.string().optional(),
  lgbt: z.boolean(),
  fvvTeh: z.boolean(),
});

export const identificationSchema = structureBaseSchema
  .and(baseIdentificationSchema)
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

export const identificationSchemaWithContacts = identificationSchema.and(
  z.object({
    contacts: z.array(z.union([contactSchema, contactSchema.optional()])),
  })
);

export const identificationSchemaWithContactsAutoSaveSchema =
  structureBaseSchema
    .partial()
    .and(baseIdentificationSchema.partial())
    .and(
      z
        .object({
          contacts: z.array(z.union([contactSchema, contactSchema.optional()])),
        })
        .partial()
    );

export type IdentificationWithContactsFormValues = z.infer<
  typeof identificationSchemaWithContacts
>;
