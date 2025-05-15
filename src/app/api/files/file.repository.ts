import { FileUpload } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export const createOne = async ({
  key,
  mimeType,
  originalName,
  category,
  date,
  fileSize,
}: CreateOneArgs): Promise<FileUpload | null> => {
  return prisma.fileUpload.create({
    data: { key, mimeType, originalName, category, date, fileSize },
  });
};

type CreateOneArgs = {
  key: string;
  mimeType: string;
  originalName: string;
  category: string;
  date: Date;
  fileSize: number;
};
