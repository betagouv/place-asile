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

export const findOneByKey = async (key: string): Promise<FileUpload | null> => {
  return prisma.fileUpload.findFirst({
    where: {
      key,
    },
  });
};

export const deleteOneByKey = async (
  key: string
): Promise<FileUpload | null> => {
  const file = await prisma.fileUpload.findFirst({
    where: {
      key,
    },
  });

  if (!file) {
    return null;
  }

  return prisma.fileUpload.delete({
    where: {
      id: Number(file.id),
    },
  });
};
