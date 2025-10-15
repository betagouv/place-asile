import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { ControleType } from "@/types/controle.type";
import { zAgentFileUploadCategory } from "@/types/file-upload.type";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zAgentFileUploadCategory,
  category: zAgentFileUploadCategory,
});

export const fileUploadSchema = z.object({
  // TODO : rendre key et category obligatoires
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zAgentFileUploadCategory,
  startDate: createDateFieldValidator().optional(),
  endDate: createDateFieldValidator().optional(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().optional(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.nativeEnum(ControleType).optional(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

const controleSchema = z.object({
  id: z.union([
    z.string().nullable().optional(),
    zSafeNumber().nullable().optional(),
  ]),
  date: createDateFieldValidator().optional(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploads: z.array(z.object({ key: z.string().optional() })).optional(),
});

export const controleSchema = z.object({
  id: z.union([
    z.string().nullable().optional(),
    zSafeNumber().nullable().optional(),
  ]),
  date: createDateFieldValidator().optional(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploads: z.array(z.object({ key: z.string().optional() })).optional(),
});

export type FileUploadFormValues = z.infer<typeof fileUploadSchema>;
export type ControleFormValues = z.infer<typeof controleSchema>;
