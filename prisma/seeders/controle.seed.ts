import {
  Controle,
  ControleType,
  FileUpload,
  FileUploadCategory,
} from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";
import { createFakeFileUpload } from "./file-upload.seed";

export type ControleWithFileUploads = Controle & {
  fileUploads: Omit<FileUpload, "id" | "controleId" | "structureDnaCode">[];
};

export const createFakeControle = (): Omit<
  ControleWithFileUploads,
  "id" | "structureDnaCode"
> => {
  return {
    date: faker.date.past(),
    type: faker.helpers.enumValue(ControleType),
    fileUploads: [
      createFakeFileUpload({
        category: FileUploadCategory.INSPECTION_CONTROLE,
      }),
    ],
  };
};
