import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import {
  zFileUploadCategory,
  zOperateurFileUploadCategory,
} from "@/types/file-upload.type";

dayjs.extend(customParseFormat);

const DocumentFinancierFlexibleSchema = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zFileUploadCategory.optional(),
});

export const DocumentsFinanciersFlexibleSchema = z.object({
  less5Years: z.boolean().optional(),
  fileUploads: z.array(DocumentFinancierFlexibleSchema),
});

const DocumentFinancierConditionalSchema =
  DocumentFinancierFlexibleSchema.superRefine((data, ctx) => {
    if (
      data.category !==
        ("BUDGET_RECTIFICATIF" as z.infer<
          typeof zOperateurFileUploadCategory
        >) &&
      data.category !==
        ("RAPPORT_BUDGETAIRE" as z.infer<typeof zOperateurFileUploadCategory>)
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
  fileUploads: z.array(DocumentFinancierConditionalSchema),
});

export type DocumentsFinanciersFlexibleFormValues = z.infer<
  typeof DocumentsFinanciersFlexibleSchema
>;
