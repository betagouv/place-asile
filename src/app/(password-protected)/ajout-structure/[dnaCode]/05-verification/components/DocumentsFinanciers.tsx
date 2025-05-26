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

  // TODO : refactor this function
  const documentIndices = useMemo(() => {
    const indices: Record<string, number> = {};
    let counter = 0;

    years.forEach((year) => {
      const currentYear = new Date().getFullYear().toString();

      documents.forEach((document) => {
        // Only count documents that will be displayed
        if (
          (currentYear === "2025" && document.currentYear) ||
          year !== currentYear
        ) {
          const key = `${document.value}-${year}`;
          indices[key] = counter++;
        }
      });
    });

    return indices;
  }, [documents, years]);

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
              const currentDocIndex = documentIndices[documentKey];
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
