import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { ControleType } from "@/types/controle.type";
import {
  zAgentFileUploadCategory,
  zFileUploadCategory,
} from "@/types/file-upload.type";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator.optional(),
  category: zAgentFileUploadCategory,
});

export const fileUploadSchema = z.object({
  key: z.string(),
  date: createDateFieldValidator.optional(),
  category: zFileUploadCategory,
  startDate: createDateFieldValidator(),
  endDate: createDateFieldValidator(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().nullish(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.nativeEnum(ControleType).optional(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

export const fileUploadAutoSaveSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator.optional(),
  category: zFileUploadCategory,
  startDate: createDateFieldValidator.optional(),
  endDate: createDateFieldValidator.optional(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().nullish(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.nativeEnum(ControleType).optional(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

export const fileUploadsSchema = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
});

export const fileUploadsAutoSaveSchema = z.object({
  fileUploads: z.array(fileUploadAutoSaveSchema).optional(),
});

export const evaluationSchema = z.object({
  id: z.union([
    z.string().nullable().optional(),
    zSafeNumber().nullable().optional(),
  ]),
  notePersonne: zSafeNumber().nullable().optional(),
  notePro: zSafeNumber().nullable().optional(),
  noteStructure: zSafeNumber().nullable().optional(),
  note: zSafeNumber().nullable().optional(),
  date: createDateFieldValidator().nullable().optional(),
  fileUploads: z.array(z.object({ key: z.string().optional() })).optional(),
});

export type FileUploadFormValues = z.infer<typeof fileUploadSchema>;

export type FileUploadsFormValues = z.infer<typeof fileUploadsSchema>;

export type FileUploadsAutoSaveFormValues = z.infer<
  typeof fileUploadsAutoSaveSchema
>;
