// Date validation is now handled directly with z.string()
import z from "zod";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { contactSchema } from "@/app/components/forms/structures/identification/fieldsets/validation/contactSchema";
import { calendrierSchema } from "@/app/components/forms/structures/identification/fieldsets/validation/calendrierSchema";
import { descriptionSchema } from "@/app/components/forms/structures/identification/fieldsets/validation/descriptionSchema";

export const IdentificationSchema = z
  .object({
    ...descriptionSchema.shape,
    contactPrincipal: contactSchema,
    contactSecondaire: contactSchema.optional(),
    ...calendrierSchema.shape,
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
