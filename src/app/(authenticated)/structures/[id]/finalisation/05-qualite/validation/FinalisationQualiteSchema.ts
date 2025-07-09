import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";
import { FileUploadCategory } from "@/types/file-upload.type";
import z from "zod";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: z.nativeEnum(FileUploadCategory).optional(),
});

const fileUploadSchema = z.object({
  // TODO : rendre key et category obligatoires
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: z.nativeEnum(FileUploadCategory).optional(),
  startDate: createDateFieldValidator().optional(),
  endDate: createDateFieldValidator().optional(),
  avenants: z.array(avenantSchema).optional(),
  // TODO : mieux séparer controleSchema et fileUploadSchema
  type: z.nativeEnum(ControleType).optional(),
});

// const controleSchema = z.object({
//   date: z.coerce.date(),
//   type: z.nativeEnum(ControleType),
// });

export const finalisationQualiteSchema = z.object({
  // controles: z.array(controleSchema),
  [FileUploadCategory.INSPECTION_CONTROLE]: z
    .array(fileUploadSchema)
    .optional(),
  [FileUploadCategory.ARRETE_AUTORISATION]: z
    .array(fileUploadSchema)
    .optional(),
  [FileUploadCategory.CONVENTION]: z.array(fileUploadSchema).optional(),
  [FileUploadCategory.ARRETE_TARIFICATION]: z
    .array(fileUploadSchema)
    .optional(),
  [FileUploadCategory.CPOM]: z.array(fileUploadSchema).optional(),
  [FileUploadCategory.AUTRE]: z.array(fileUploadSchema).optional(),
});
