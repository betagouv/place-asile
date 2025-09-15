import z from "zod";

import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { PublicType, StructureType } from "@/types/structure.type";

import { contactSchema } from "./contactSchema";

export const IdentificationSchema = z
  .object({
    dnaCode: z.string().nonempty(),
    operateur: z.object({
      id: z.number(),
      name: z.string(),
    }),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(StructureType)
    ),
    creationDate: createDateFieldValidator(),
    finessCode: z.string().optional().or(z.literal("")),
    public: z.enum(PublicType),
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
      path: ["debutCpom"],
        error: "La date de début CPOM est obligatoire"
    }
  )
  .refine(
    (data) => {
      return !data.cpom || data.finCpom;
    },
    {
      path: ["finCpom"],
        error: "La date de fin CPOM est obligatoire"
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
      path: ["debutPeriodeAutorisation"],
        error: "La date de début est obligatoire pour les structures autorisées"
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
      path: ["finPeriodeAutorisation"],
        error: "La date de fin est obligatoire pour les structures autorisées"
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
      path: ["debutConvention"],
        error: "La date de début est obligatoire pour les structures subventionnées"
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
      path: ["finConvention"],
        error: "La date de fin est obligatoire pour les structures subventionnées"
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
      path: ["finessCode"],
        error: "Le code FINESS est obligatoire pour les structures autorisées"
    }
  );

export type IdentificationFormValues = z.infer<typeof IdentificationSchema>;
