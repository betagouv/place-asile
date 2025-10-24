import z from "zod";

import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { createOptionalDateValidator } from "@/app/utils/zodCustomFields";

import { structureBaseSchema } from "./structure.base.schema";

const baseCalendrierSchema = structureBaseSchema.extend({
  debutPeriodeAutorisation: createOptionalDateValidator(),
  finPeriodeAutorisation: createOptionalDateValidator(),
  debutConvention: createOptionalDateValidator(),
  finConvention: createOptionalDateValidator(),
  debutCpom: createOptionalDateValidator(),
  finCpom: createOptionalDateValidator(),
});
export const calendrierSchema = baseCalendrierSchema
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
        data.debutPeriodeAutorisation &&
        data.finPeriodeAutorisation &&
        data.debutPeriodeAutorisation !== "" &&
        data.finPeriodeAutorisation !== ""
      ) {
        const debutDate = new Date(
          data.debutPeriodeAutorisation.split("/").reverse().join("-")
        );
        const finDate = new Date(
          data.finPeriodeAutorisation.split("/").reverse().join("-")
        );
        return finDate > debutDate;
      }
      return true;
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["finPeriodeAutorisation"],
    }
  )
  .refine(
    (data) => {
      if (
        data.debutConvention &&
        data.finConvention &&
        data.debutConvention !== "" &&
        data.finConvention !== ""
      ) {
        const debutDate = new Date(
          data.debutConvention.split("/").reverse().join("-")
        );
        const finDate = new Date(
          data.finConvention.split("/").reverse().join("-")
        );
        return finDate > debutDate;
      }
      return true;
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["finConvention"],
    }
  )
  .refine(
    (data) => {
      if (
        data.debutCpom &&
        data.finCpom &&
        data.debutCpom !== "" &&
        data.finCpom !== ""
      ) {
        const debutDate = new Date(
          data.debutCpom.split("/").reverse().join("-")
        );
        const finDate = new Date(data.finCpom.split("/").reverse().join("-"));
        return finDate > debutDate;
      }
      return true;
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["finCpom"],
    }
  );

export const calendrierAutoSaveSchema = baseCalendrierSchema.partial();

export type CalendrierFormValues = z.infer<typeof calendrierSchema>;
