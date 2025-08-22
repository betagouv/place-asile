import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";
import { FileUploadCategory } from "@prisma/client";
import z from "zod";

const avenantSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: z.nativeEnum(FileUploadCategory).optional(),
});

export const fileUploadSchema = z.object({
  // TODO : rendre key et category obligatoires
  key: z.string(),
  date: createDateFieldValidator().optional(),
  category: z.nativeEnum(FileUploadCategory).optional(),
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
  fileUploads: z.object({
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
  }),
  // controles: z.array(controleSchema),
});

export const finalisationQualiteSchemaSimple = z.object({
  fileUploads: z.array(fileUploadSchema).optional(),
});
