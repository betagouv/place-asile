import { FileUpload, FileUploadCategory } from "@prisma/client";

import prisma from "@/lib/prisma";
import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { DocumentFinancierApiType } from "@/schemas/api/documentFinancier.schema";
import {
  ActeAdministratifCategory,
  DocumentFinancierCategory,
} from "@/types/file-upload.type";
import { PrismaTransaction } from "@/types/prisma.type";

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
  tx: PrismaTransaction,
  fileUploadsToKeep: Partial<
    ActeAdministratifApiType | DocumentFinancierApiType
  >[],
  structureId: number,
  category?: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  const allFileUploads = await tx.fileUpload.findMany({
    where: { structureId },
  });

  const fileUploadsToDelete = allFileUploads.filter((fileUpload) => {
    if (!fileUpload.category || !category) {
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
      tx.fileUpload.delete({ where: { id: fileUpload.id } })
    )
  );
};

export const updateFileUploads = async (
  tx: PrismaTransaction,
  fileUploads:
    | Partial<ActeAdministratifApiType | DocumentFinancierApiType>[]
    | undefined,
  structureId: number,
  category?: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  if (!fileUploads || fileUploads.length === 0) {
    return;
  }

  await deleteFileUploads(tx, fileUploads, structureId, category);

  await Promise.all(
    fileUploads.map((fileUpload) =>
      tx.fileUpload.update({
        where: { key: fileUpload.key },
        data: {
          date: fileUpload.date,
          category: (fileUpload.category as FileUploadCategory) || null,
          startDate: fileUpload.startDate,
          endDate: fileUpload.endDate,
          categoryName: fileUpload.categoryName,
          structureId,
          parentFileUploadId: fileUpload.parentFileUploadId,
          controleId: fileUpload.controleId,
          evaluationId: fileUpload.evaluationId,
        },
      })
    )
  );
};

export const createDocumentsFinanciers = async (
  tx: PrismaTransaction,
  documentsFinanciers: DocumentFinancierApiType[],
  structureId: number
): Promise<void> => {
  for (const documentFinancier of documentsFinanciers) {
    await tx.fileUpload.update({
      where: { key: documentFinancier.key },
      data: {
        date: documentFinancier.date,
        category: (documentFinancier.category as FileUploadCategory) || null,
        structureId,
      },
    });
  }
};
