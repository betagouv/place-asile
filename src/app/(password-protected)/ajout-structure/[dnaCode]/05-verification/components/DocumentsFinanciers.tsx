import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import {
  DocumentsSchemaFlexible,
  IdentificationFormValues,
} from "../../../validation/validation";
import { useParams } from "next/navigation";
import { z } from "zod";
import { ReactElement, useMemo } from "react";
import { Year } from "../../../components/Year";
import { FileItem } from "../../../components/FileItem";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "../../04-documents/documents";
import { useDocumentIndex } from "@/app/hooks/useDocumentIndex";

type DocumentsFinanciersFormValues = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsFinanciers = (): ReactElement => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<DocumentsFinanciersFormValues>
  >(`ajout-structure-${params.dnaCode}-documents`, {});

  const years = useMemo(
    () => ["2025", "2024", "2023", "2022", "2021"] as const,
    []
  );

  const { currentValue: identificationValues } = useLocalStorage<
    Partial<IdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const documents = isStructureAutorisee(identificationValues?.type)
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const { getDocumentIndexes } = useDocumentIndex();

  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

  return (
    <>
      {years.map((year) => (
        <Year key={year} year={year}>
          {documents.map((document) => {
            const currentYear = new Date().getFullYear().toString();
            if (
              (currentYear === "2025" && document.currentYear) ||
              year !== currentYear
            ) {
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
