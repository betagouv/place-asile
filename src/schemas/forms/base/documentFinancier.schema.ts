import { z } from "zod";

import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import { getYearRange } from "@/app/utils/date.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import {
  frenchDateToISO,
  nullishFrenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { DocumentFinancierCategory } from "@/types/file-upload.type";
import { StructureType } from "@/types/structure.type";

const DocumentFinancierFlexibleSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: z.enum(DocumentFinancierCategory).optional(),
  granularity: z.string().optional(),
  nom: z.string().optional(),
});

export const DocumentsFinanciersFlexibleSchema = z.object({
  date303: nullishFrenchDateToISO(),
  documentsFinanciers: z.array(DocumentFinancierFlexibleSchema).optional(),
  structureMillesimes: z
    .array(
      z.object({
        date: frenchDateToISO(),
        cpom: z.boolean(),
        operateurComment: z.string().nullish(),
      })
    )
    .optional(),
});

export const DocumentsFinanciersStrictSchema =
  DocumentsFinanciersFlexibleSchema.extend({
    creationDate: optionalFrenchDateToISO(),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType)
    ),
  }).superRefine((data, ctx) => {
    const isAutorisee = isStructureAutorisee(data.type);
    const documents = isAutorisee
      ? structureAutoriseesDocuments
      : structureSubventionneesDocuments;

    const { years } = getYearRange();

    const yearsToDisplay = isAutorisee ? years : years.slice(2);

    const referenceYear = Number(
      (data.date303 ?? data.creationDate)?.substring(0, 4)
    );

    yearsToDisplay.forEach((year) => {
      if (year >= referenceYear) {
        documents.forEach((document) => {
          const documentIsRequired = document.required;
          if (documentIsRequired) {
            const requiredDocument = data.documentsFinanciers?.find(
              (documentFinancier) =>
                documentFinancier.category === document.value &&
                documentFinancier.date?.substring(0, 4) === String(year)
            );
            if (!requiredDocument) {
              ctx.addIssue({
                path: ["documentsFinanciers", year],
                code: z.ZodIssueCode.custom,
                message: "Ce champ est requis",
              });
            }
          }
        });
      }
    });
  });

export type DocumentFinancierFlexibleFormValues = z.infer<
  typeof DocumentFinancierFlexibleSchema
>;

export type DocumentsFinanciersFlexibleFormValues = z.infer<
  typeof DocumentsFinanciersFlexibleSchema
>;
