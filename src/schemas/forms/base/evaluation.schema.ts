import z from "zod";

import {
  frenchDateToISO,
  zSafeDecimalsNullish,
} from "@/app/utils/zodCustomFields";

const idPreprocess = (val: unknown) => (val === "" ? undefined : val);

const fileUploadSchema = z.object({
  key: z.string().optional(),
  id: z.preprocess(idPreprocess, z.number().optional()),
});

const evaluationAutoSaveSchema = z.object({
  id: z.preprocess(idPreprocess, z.number().optional()),
  date: frenchDateToISO(),
  notePersonne: zSafeDecimalsNullish(),
  notePro: zSafeDecimalsNullish(),
  noteStructure: zSafeDecimalsNullish(),
  note: zSafeDecimalsNullish(),
  fileUploads: z.array(fileUploadSchema.optional()).optional(),
});

export const evaluationSchema = evaluationAutoSaveSchema
  .refine(
    (data) => {
      const year = data.date ? new Date(data.date).getFullYear() : undefined;
      const requireNotes = year !== undefined && year >= 2022;

      if (requireNotes) {
        if (
          data.notePersonne === undefined ||
          data.notePro === undefined ||
          data.noteStructure === undefined ||
          data.note === undefined
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Les notes doivent être renseignées",
      path: ["notePersonne", "notePro", "noteStructure", "note"],
    }
  )
  .refine(
    (data) => {
      if (data.fileUploads) {
        return (
          data.fileUploads[0]?.key !== undefined &&
          data.fileUploads[0]?.id !== undefined
        );
      }
      return true;
    },
    {
      message: "Les fichiers doivent être renseignés",
      path: ["fileUploads"],
    }
  );

export const evaluationsSchema = z.object({
  evaluations: z.array(evaluationSchema).optional(),
});

export const evaluationsAutoSaveSchema = z.object({
  evaluations: z.array(evaluationAutoSaveSchema).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type EvaluationsFormValues = z.infer<typeof evaluationsSchema>;

export type EvaluationAutoSaveFormValues = z.infer<
  typeof evaluationAutoSaveSchema
>;
export type EvaluationsAutoSaveFormValues = z.infer<
  typeof evaluationsAutoSaveSchema
>;
