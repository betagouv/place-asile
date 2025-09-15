import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";
import { zDdetsFileUploadCategory } from "@/types/file-upload.type";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zDdetsFileUploadCategory,
});

export const fileUploadSchema = z.object({
  // TODO : rendre key et category obligatoires
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zDdetsFileUploadCategory,
  startDate: createDateFieldValidator().optional(),
  endDate: createDateFieldValidator().optional(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().optional(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.enum(ControleType).optional(),
  parentFileUploadId: z.any().optional(),
  uuid: z.string().optional(),
});

// const controleSchema = z.object({
//   date: z.coerce.date(),
//   type: z.nativeEnum(ControleType),
// });

export const finalisationQualiteSchema = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
  // controles: z.array(controleSchema),
});

export const finalisationQualiteSchemaSimple = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
});
