import z from "zod";

import { isStructureAutorisee } from "@/app/utils/structure.util";
import { contactSchema } from "@/schemas/base/contact.schema";
import { PublicType } from "@/types/structure.type";

import { structureBaseSchema } from "./structure.base.schema";

export const identificationSchema = structureBaseSchema
  .extend({
    operateur: z.object({
      id: z.number(),
      name: z.string(),
    }),
    creationDate: z.string().min(1),
    finessCode: z.string().optional().or(z.literal("")),
    public: z.nativeEnum(PublicType),
    filiale: z.string().optional(),
    lgbt: z.boolean(),
    fvvTeh: z.boolean(),
    contacts: z.array(z.union([contactSchema, contactSchema.optional()])),
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

export type IdentificationFormValues = z.infer<typeof identificationSchema>;
