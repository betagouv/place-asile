import { z } from "zod";

import {
  nullishFrenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { DocumentFinancierCategory } from "@/types/file-upload.type";

const DocumentFinancierFlexibleSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: z.enum(DocumentFinancierCategory).optional(),
  granularity: z.string().optional(),
  nom: z.string().optional(),
});

export const DocumentsFinanciersFlexibleSchema = z.object({
  creationDate: optionalFrenchDateToISO(),
  date303: nullishFrenchDateToISO(),
  documentsFinanciers: z.array(DocumentFinancierFlexibleSchema),
  structureMillesimes: z.array(
    z.object({
      date: optionalFrenchDateToISO(),
      cpom: z.boolean(),
      operateurComment: z.string(),
    })
  ),
});

export const DocumentsFinanciersStrictSchema =
  DocumentsFinanciersFlexibleSchema.superRefine((data, ctx) => {
    const referenceYear = Number(
      (data.date303 ?? data.creationDate)?.substring(0, 4)
    );

    data.documentsFinanciers.forEach((document, index) => {
      const documentYear = document.date?.substring(0, 4);

      const documentIsAfterReferenceYear =
        Number(documentYear) >= referenceYear;

      const documentIsRequired =
        document.category !== "BUDGET_RECTIFICATIF" &&
        document.category !== "RAPPORT_BUDGETAIRE";

      if (documentIsAfterReferenceYear && documentIsRequired && !document.key) {
        ctx.addIssue({
          path: ["documentsFinanciers", index, "key"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
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
