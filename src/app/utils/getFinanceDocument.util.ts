import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/financeForm/documents/documentsStructures";
import {
  convertObjectToArray,
  reverseObjectKeyValues,
} from "@/app/utils/common.util";
import { Budget } from "@/types/budget.type";
import { Structure } from "@/types/structure.type";

import { StructureDocument } from "../(password-protected)/ajout-structure/[dnaCode]/04-documents/documents";
import { getDateStringToYear, getYearRange } from "./date.util";

export const getFinanceDocument = ({
  structure,
  isAutorisee,
}: {
  structure: Structure;
  isAutorisee: boolean;
}) => {
  const { years } = getYearRange();
  const { dateStringToYear } = getDateStringToYear();

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

  const budgetsFilteredByYears =
    structure?.budgets?.filter((budget) =>
      years.includes(Number(dateStringToYear(budget.date.toString())))
    ) || [];

  const budgetArray: Budget[] = Array(5)
    .fill({})
    .map((emptyBudget, index) =>
      index < budgetsFilteredByYears.length
        ? budgetsFilteredByYears[index]
        : emptyBudget
    );

  const buildFileUploadsDefaultValues = () => {
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
      return fileUpload ?? null;
    });
    return fileUploads;
  };

  return {
    budgetArray,
    buildFileUploadsDefaultValues,
  };
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
