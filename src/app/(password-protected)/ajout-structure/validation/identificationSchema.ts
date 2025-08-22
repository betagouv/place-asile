import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import z from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { contactSchema } from "./contactSchema";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";

export const IdentificationSchema = z
  .object({
    dnaCode: z.string().nonempty(),
    operateur: z.string().nonempty(),
    // TODO : renommer en operateur
    newOperateur: z.object({
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
    contactPrincipal: contactSchema,
    contactSecondaire: contactSchema.optional(),
    debutPeriodeAutorisation: createDateFieldValidator().optional(),
    finPeriodeAutorisation: createDateFieldValidator().optional(),
    debutConvention: createDateFieldValidator().optional(),
    finConvention: createDateFieldValidator().optional(),
    debutCpom: createDateFieldValidator().optional(),
    finCpom: createDateFieldValidator().optional(),
  })
  .refine(
    (data) => {
      return !data.cpom || data.debutCpom;
    },
    {
      message: "La date de début CPOM est obligatoire",
      path: ["debutCpom"],
    }
  )
  .refine(
    (data) => {
      return !data.cpom || data.finCpom;
    },
    {
      message: "La date de fin CPOM est obligatoire",
      path: ["finCpom"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.debutPeriodeAutorisation || data.debutPeriodeAutorisation === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date de début est obligatoire pour les structures autorisées",
      path: ["debutPeriodeAutorisation"],
    }
  )
  .refine(
    (data) => {
      if (
        isStructureAutorisee(data.type) &&
        (!data.finPeriodeAutorisation || data.finPeriodeAutorisation === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "La date de fin est obligatoire pour les structures autorisées",
      path: ["finPeriodeAutorisation"],
    }
  )
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
        "La date de début est obligatoire pour les structures subventionnées",
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
        "La date de fin est obligatoire pour les structures subventionnées",
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

export type IdentificationFormValues = z.infer<typeof IdentificationSchema>;
