import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { ControleType } from "@/types/controle.type";

const idPreprocess = (val: unknown) => (val === "" ? undefined : val);

const fileUploadSchema = z.object({
  key: z.string().optional(),
  id: z.preprocess(idPreprocess, z.number().optional()),
});

export const controleAutoSaveSchema = z.object({
  id: z.preprocess(idPreprocess, z.number().optional()),
  date: optionalFrenchDateToISO(),
  type: z.nativeEnum(ControleType).optional(),
  fileUploads: z.array(fileUploadSchema.optional()).optional(),
});

export const controleSchema = controleAutoSaveSchema.refine(
  (data) => {
    if (data.fileUploads) {
      if (
        data.fileUploads[0]?.key === undefined &&
        data.fileUploads[0]?.id === undefined
      ) {
        return true;
      }
      if (
        data.fileUploads[0]?.key === undefined ||
        data.fileUploads[0]?.id === undefined
      ) {
        return false;
      }
      return true;
    }
    return true;
  },
  {
    message: "Les fichier de l'inspection-contrôle doit être renseigné",
    path: ["fileUploads"],
  }
);

export const controlesSchema = z.object({
  controles: z.array(controleSchema).optional(),
});

export const controlesAutoSaveSchema = z.object({
  controles: z.array(controleAutoSaveSchema).optional(),
});

export type ControleFormValues = z.infer<typeof controleSchema>;
export type ControlesFormValues = z.infer<typeof controlesSchema>;
