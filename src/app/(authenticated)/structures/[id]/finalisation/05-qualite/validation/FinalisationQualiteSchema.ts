import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";
import { DdetsFileUploadCategory } from "@/types/file-upload.type";

import z from "zod";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: z.nativeEnum(DdetsFileUploadCategory).optional(),
});

export const fileUploadSchema = z.object({
  // TODO : rendre key et category obligatoires
  key: z.string(),
  date: createDateFieldValidator().optional(),
  category: z.string().optional(),
  startDate: createDateFieldValidator().optional(),
  endDate: createDateFieldValidator().optional(),
  avenants: z.array(avenantSchema).optional(),
  categoryName: z.string().optional(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.nativeEnum(ControleType).optional(),
  parentFileUploadId: z.any().optional(),
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
