import {
  createDateFieldValidator,
  createOptionalDateValidator,
} from "@/app/utils/zodCustomFields";
import z from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { contactSchema } from "@/app/(password-protected)/ajout-structure/validation/contactSchema";

export const finalisationIdentificationSchema = z
  .object({
    dnaCode: z.string().nonempty(),
    operateur: z.object({
      id: z.number(),
      name: z.string(),
    }),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType)
    ),
    creationDate: createDateFieldValidator(),
    finessCode: z.string().optional().or(z.literal("")),
    public: z.nativeEnum(PublicType),
    filiale: z.string().optional(),
    cpom: z.boolean(),
    lgbt: z.boolean(),
    fvvTeh: z.boolean(),
    contacts: z.array(z.union([contactSchema, contactSchema])),
    debutPeriodeAutorisation: createOptionalDateValidator(),
    finPeriodeAutorisation: createOptionalDateValidator(),
    debutConvention: createOptionalDateValidator(),
    finConvention: createOptionalDateValidator(),
    debutCpom: createOptionalDateValidator(),
    finCpom: createOptionalDateValidator(),
  })
  .refine(
    (data) => {
      if (data.cpom && !data.debutCpom) {
        return false;
      }
      return true;
    },
    {
      message: "La date de début CPOM est obligatoire",
      path: ["debutCpom"],
    }
  )
  .refine(
    (data) => {
      if (data.cpom && !data.finCpom) {
        return false;
      }
      return true;
    },
    {
      message: "La date de fin CPOM est obligatoire",
      path: ["finCpom"],
    }
  )
  .superRefine((data, ctx) => {
    if (isStructureAutorisee(data.type)) {
      if (!data.debutPeriodeAutorisation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La date de début de période d'autorisation est obligatoire pour les structures autorisées",
          path: ["debutPeriodeAutorisation"],
        });
      }

      if (data.cpom && !data.finPeriodeAutorisation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La date de fin de période d'autorisation est obligatoire pour les structures autorisées",
          path: ["finPeriodeAutorisation"],
        });
      }
    }
  })
  .refine(
    (data) => {
      if (
        isStructureSubventionnee(data.type) &&
        (!data.debutConvention || data.debutConvention === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de début de convention est obligatoire pour les structures subventionnées",
      path: ["debutConvention"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureSubventionnee(data.type) &&
        (!data.finConvention || data.finConvention === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de fin de convention est obligatoire pour les structures subventionnées",
      path: ["finConvention"],
    }
  )
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

export type FinalisationIdentificationFormValues = z.infer<
  typeof finalisationIdentificationSchema
>;
