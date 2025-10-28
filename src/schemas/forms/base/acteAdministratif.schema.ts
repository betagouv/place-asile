import z from "zod";

import {
  frenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import {
  zActeAdministratifCategory,
  zFileUploadCategory,
} from "@/types/file-upload.type";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: zActeAdministratifCategory,
});

export const acteAdministratifSchema = z.object({
  key: z.string(),
  date: optionalFrenchDateToISO(),
  category: zFileUploadCategory,
  startDate: frenchDateToISO(),
  endDate: frenchDateToISO(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().nullish(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

export const acteAdministratifAutoSaveSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: zFileUploadCategory,
  startDate: optionalFrenchDateToISO(),
  endDate: optionalFrenchDateToISO(),
  avenants: z.array(avenantSchema).optional(),
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
