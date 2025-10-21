import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import {
  convertObjectToArray,
  reverseObjectKeyValues,
} from "@/app/utils/common.util";
import { Structure } from "@/types/structure.type";

import { StructureDocument } from "../(password-protected)/ajout-structure/[dnaCode]/04-documents/documents";
import { getYearDate, getYearRange } from "./date.util";

export const buildFileUploadsDefaultValues = ({
  structure,
  isAutorisee,
}: {
  structure: Structure;
  isAutorisee: boolean;
}) => {
  const { years } = getYearRange();

  const documentsToDisplay = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documentsToDisplay
  );

  const indexWithValues = reverseObjectKeyValues(documentIndexes);
  const documents = convertObjectToArray(indexWithValues);
  const fileUploads = documents.map((document) => {
    const [fileUploadCategory, year] = document.toString().split("-");
    const fileUpload = structure.fileUploads?.find((fileUpload) => {
      return (
        fileUpload.category === fileUploadCategory &&
        new Date(fileUpload.date || "").getFullYear() === Number(year)
      );
    });

    if (fileUpload && fileUpload.category) {
      return fileUpload;
    }

    return {
      key: fileUpload?.key ?? undefined,
      category: fileUploadCategory,
      date: getYearDate(year),
    };
  });
  return fileUploads;
};

export const getDocumentIndexes = (
  years: string[],
  documents: StructureDocument[]
) => {
  const indexes: Record<string, number> = {};
  let counter = 0;

  years.forEach((year) => {
    documents.forEach((document) => {
      const todayYear = new Date().getFullYear();
      if (Number(year) <= todayYear - document.yearIndex) {
        const key = `${document.value}-${year}`;
        indexes[key] = counter++;
      }
    });
  });

  return indexes;
};
