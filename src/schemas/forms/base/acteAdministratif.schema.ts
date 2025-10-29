import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { ActeAdministratifCategory } from "@/types/file-upload.type";

const acteAdministratifSchema = z
  .object({
    key: z.string(),
    date: optionalFrenchDateToISO(),
    category: z.enum(ActeAdministratifCategory),
    startDate: optionalFrenchDateToISO(),
    endDate: optionalFrenchDateToISO(),
    categoryName: z.string().nullish(),
    parentFileUploadId: z.any().optional(),
    uuid: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.category !== "AUTRE" && !data.parentFileUploadId) {
        return !!data.startDate && !!data.endDate;
      }
      return true;
    },
    {
      message: "Les dates de début et de fin sont obligatoires.",
      path: ["endDate", "startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.parentFileUploadId) {
        return !!data.date;
      }
      return true;
    },
    {
      message: "La date est obligatoire pour les avenants.",
      path: ["date"],
    }
  );

const acteAdministratifAutoSaveSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: z.enum(ActeAdministratifCategory),
  startDate: optionalFrenchDateToISO(),
  endDate: optionalFrenchDateToISO(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

export const actesAdministratifsSchema = z.object({
  actesAdministratifs: z.array(acteAdministratifSchema).optional(),
});

export const actesAdministratifsAutoSaveSchema = z.object({
  actesAdministratifs: z.array(acteAdministratifAutoSaveSchema).optional(),
});

export type ActeAdministratifFormValues = z.infer<
  typeof acteAdministratifSchema
>;

export type ActesAdministratifsFormValues = z.infer<
  typeof actesAdministratifsSchema
>;

export type ActesAdministratifsAutoSaveFormValues = z.infer<
  typeof actesAdministratifsAutoSaveSchema
>;
