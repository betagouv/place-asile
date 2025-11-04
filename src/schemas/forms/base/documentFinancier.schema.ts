import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";

import {
  frenchDateToISO,
  nullishFrenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { DocumentFinancierCategory } from "@/types/file-upload.type";

dayjs.extend(customParseFormat);

const DocumentFinancierFlexibleSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: z.enum(DocumentFinancierCategory).optional(),
});

export const DocumentsFinanciersFlexibleSchema = z.object({
  creationDate: nullishFrenchDateToISO(),
  date303: nullishFrenchDateToISO(),
  documentsFinanciers: z.array(DocumentFinancierFlexibleSchema),
});

export const DocumentsFinanciersStrictSchema = z
  .object({
    creationDate: frenchDateToISO(),
    date303: nullishFrenchDateToISO(),
    documentsFinanciers: z.array(DocumentFinancierFlexibleSchema),
  })
  .superRefine((data, ctx) => {
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
