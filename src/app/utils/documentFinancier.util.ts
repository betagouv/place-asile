import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import {
  convertObjectToArray,
  reverseObjectKeyValues,
} from "@/app/utils/common.util";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { DocumentFinancierFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";
import { DocumentFinancierCategoryType } from "@/types/file-upload.type";

import { StructureDocument } from "../(password-protected)/ajout-structure/[dnaCode]/04-documents/documents";
import { getYearDate, getYearRange } from "./date.util";

export const getDocumentsFinanciersDefaultValues = ({
  structure,
  isAutorisee,
}: {
  structure: StructureApiType;
  isAutorisee: boolean;
}): DocumentFinancierFlexibleFormValues[] => {
  let startYear: number = structure?.date303
    ? new Date(structure.date303).getFullYear()
    : new Date(structure.creationDate).getFullYear();
  if (startYear < 2021) {
    startYear = 2021;
  }
  const { years } = getYearRange({ startYear });

  const documentsToDisplay = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documentsToDisplay
  );

  const indexWithValues = reverseObjectKeyValues(documentIndexes);
  const documents = convertObjectToArray(indexWithValues);
  const documentsFinanciers = documents.map((document) => {
    const [category, year] = document.toString().split("-");
    const documentFinancier = structure.documentsFinanciers?.find(
      (documentFinancier) => {
        return (
          documentFinancier.category === category &&
          new Date(documentFinancier.date || "").getFullYear() === Number(year)
        );
      }
    );

    if (documentFinancier && documentFinancier.category) {
      return documentFinancier;
    }

    return {
      key: documentFinancier?.key ?? undefined,
      category: category as DocumentFinancierCategoryType[number],
      date: getYearDate(year),
    };
  });
  return documentsFinanciers;
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
