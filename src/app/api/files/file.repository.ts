import { FileUpload, FileUploadCategory } from "@prisma/client";

import prisma from "@/lib/prisma";
import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { DocumentFinancierApiType } from "@/schemas/api/documentFinancier.schema";
import {
  ActeAdministratifCategory,
  DocumentFinancierCategory,
} from "@/types/file-upload.type";

export const createOne = async ({
  key,
  mimeType,
  originalName,
  fileSize,
}: CreateOneArgs): Promise<FileUpload | null> => {
  return prisma.fileUpload.create({
    data: { key, mimeType, originalName, fileSize },
  });
};

type CreateOneArgs = {
  key: string;
  mimeType: string;
  originalName: string;
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

const deleteFileUploads = async (
  fileUploadsToKeep: Partial<
    ActeAdministratifApiType | DocumentFinancierApiType
  >[],
  structureDnaCode: string,
  category: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  const allFileUploads = await prisma.fileUpload.findMany({
    where: { structureDnaCode: structureDnaCode },
  });

  const fileUploadsToDelete = allFileUploads.filter((fileUpload) => {
    if (!fileUpload.category) {
      return false;
    }

    const isAllowedCategory =
      category === "acteAdministratif"
        ? ActeAdministratifCategory.includes(
            fileUpload.category as (typeof ActeAdministratifCategory)[number]
          )
        : DocumentFinancierCategory.includes(
            fileUpload.category as (typeof DocumentFinancierCategory)[number]
          );

    if (!isAllowedCategory) {
      return false;
    }

    return !fileUploadsToKeep.some(
      (fileUploadToKeep) => fileUploadToKeep.key === fileUpload.key
    );
  });

  await Promise.all(
    fileUploadsToDelete.map((fileUpload) =>
      prisma.fileUpload.delete({ where: { id: fileUpload.id } })
    )
  );
};

export const updateFileUploads = async (
  fileUploads:
    | Partial<ActeAdministratifApiType | DocumentFinancierApiType>[]
    | undefined,
  structureDnaCode: string,
  category: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  if (!fileUploads || fileUploads.length === 0) {
    return;
  }

  await deleteFileUploads(fileUploads, structureDnaCode, category);

  await Promise.all(
    (fileUploads || []).map((fileUpload) =>
      prisma.fileUpload.update({
        where: { key: fileUpload.key },
        data: {
          date: fileUpload.date,
          category: (fileUpload.category as FileUploadCategory) || null,
          startDate: fileUpload.startDate,
          endDate: fileUpload.endDate,
          categoryName: fileUpload.categoryName,
          structureDnaCode,
          parentFileUploadId: fileUpload.parentFileUploadId,
          controleId: fileUpload.controleId,
          evaluationId: fileUpload.evaluationId,
        },
      })
    )
  );
};
