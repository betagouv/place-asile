import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { DocumentFinancierCategory } from "@/types/file-upload.type";

dayjs.extend(customParseFormat);

const DocumentFinancierFlexibleSchema = z.object({
  key: z.string().optional(),
  date: optionalFrenchDateToISO(),
  category: z.enum(DocumentFinancierCategory).optional(),
});

export const DocumentsFinanciersFlexibleSchema = z.object({
  less5Years: z.boolean().optional(),
  documentsFinanciers: z.array(DocumentFinancierFlexibleSchema),
});

const DocumentFinancierConditionalSchema =
  DocumentFinancierFlexibleSchema.superRefine((data, ctx) => {
    if (
      data.category !== "BUDGET_RECTIFICATIF" &&
      data.category !== "RAPPORT_BUDGETAIRE"
    ) {
      if (!data.key) {
        ctx.addIssue({
          path: ["key"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
      if (!data.category) {
        ctx.addIssue({
          path: ["category"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
    }
  });

export const DocumentsFinanciersStrictSchema = z.object({
  less5Years: z.boolean().optional(),
  documentsFinanciers: z.array(DocumentFinancierConditionalSchema),
});

export type DocumentFinancierFlexibleFormValues = z.infer<
  typeof DocumentFinancierFlexibleSchema
>;

export type DocumentsFinanciersFlexibleFormValues = z.infer<
  typeof DocumentsFinanciersFlexibleSchema
>;
