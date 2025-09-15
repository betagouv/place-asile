import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zOperateurFileUploadCategory } from "@/types/file-upload.type";

dayjs.extend(customParseFormat);

export const DocumentsTypeFlexible = z.object({
  key: z.string().optional(),
  date: createDateFieldValidator().optional(),
  category: zOperateurFileUploadCategory.optional(),
});

export type DocumentsTypeFlexible = z.infer<typeof DocumentsSchemaFlexible>;

export const DocumentsSchemaFlexible = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeFlexible),
});

export const DocumentsTypeConditional = z
  .object({
    key: z.string().optional(),
    date: createDateFieldValidator().optional(),
    category: zOperateurFileUploadCategory.optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.category !==
        ("BUDGET_RECTIFICATIF" as z.infer<typeof zOperateurFileUploadCategory>) &&
      data.category !==
        ("RAPPORT_BUDGETAIRE" as z.infer<typeof zOperateurFileUploadCategory>)
    ) {
      if (!data.key) {
        ctx.addIssue({
          path: ["key"],
          code: "custom",
          message: "Ce champ est requis",
        });
      }
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          code: "custom",
          message: "Ce champ est requis",
        });
      }
      if (!data.category) {
        ctx.addIssue({
          path: ["category"],
          code: "custom",
          message: "Ce champ est requis",
        });
      }
    }
  });

export type DocumentsSchemaFlexible = z.infer<typeof DocumentsSchemaFlexible>;

export const DocumentsTypeStrict = z.object({
  key: z.string(),
  date: createDateFieldValidator(),
  category: zOperateurFileUploadCategory,
});

export const DocumentsSchemaStrict = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeConditional),
});

export type DocumentsTypeStrict = z.infer<typeof DocumentsSchemaStrict>;
export type DocumentsSchemaStrict = z.infer<typeof DocumentsSchemaStrict>;
