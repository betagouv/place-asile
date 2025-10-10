import { useParams } from "next/navigation";
import { ReactElement, useMemo } from "react";
import { z } from "zod";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { getDocumentIndexes } from "@/app/utils/getFinanceDocument.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { DocumentsSchemaFlexible } from "@/schemas/ajout/ajoutDocuments.schema";
import { AjoutIdentificationFormValues } from "@/schemas/ajout/ajoutIdentification.schema";

import { FileItem } from "../../../components/FileItem";
import { Year } from "../../../components/Year";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "../../04-documents/documents";

type DocumentsFinanciersFormValues = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsFinanciers = (): ReactElement => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<DocumentsFinanciersFormValues>
  >(`ajout-structure-${params.dnaCode}-documents`, {});

  const { currentValue: identificationValues } = useLocalStorage<
    Partial<AjoutIdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const isAutorisee = isStructureAutorisee(identificationValues?.type);

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const years = useMemo(
    () =>
      isAutorisee
        ? ["2025", "2024", "2023", "2022", "2021"]
        : (["2023", "2022", "2021"] as const),
    [isAutorisee]
  );

  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

  return (
    <>
      {years.map((year) => (
        <Year key={year} year={year}>
          {documents.map((document) => {
            const todayYear = new Date().getFullYear();
            if (Number(year) <= todayYear - document.yearIndex) {
              const documentKey = `${document.value}-${year}`;
              const currentDocIndex = documentIndexes[documentKey];
              return (
                <FileItem
                  key={`${document.value}-${year}`}
                  title={document.label}
                  fileKey={
                    localStorageValues?.fileUploads?.[currentDocIndex]?.key
                  }
                />
              );
            }
            return null;
          })}
        </Year>
      ))}
    </>
  );
};
