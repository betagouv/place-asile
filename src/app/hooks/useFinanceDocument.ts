import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/financeForm/documents/documentsStructures";
import { useDateStringToYear } from "@/app/hooks/useDateStringToYear";
import { useDocumentIndex } from "@/app/hooks/useDocumentIndex";
import { useYearRange } from "@/app/hooks/useYearRange";
import {
  convertObjectToArray,
  reverseObjectKeyValues,
} from "@/app/utils/common.util";
import { Structure } from "@/types/structure.type";

export const useFinanceDocument = ({ structure, isAutorisee }: Props) => {
  const { years } = useYearRange();
  const { dateStringToYear } = useDateStringToYear();

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const { getDocumentIndexes } = useDocumentIndex();
  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

  const budgetsFilteredByYears =
    structure?.budgets?.filter((budget) =>
      years.includes(Number(dateStringToYear(budget.date.toString())))
    ) || [];

  const budgetArray = Array(5)
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

type Props = {
  structure: Structure;
  isAutorisee: boolean;
};
