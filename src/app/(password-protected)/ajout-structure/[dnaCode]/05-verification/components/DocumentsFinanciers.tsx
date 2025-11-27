import { useParams } from "next/navigation";
import { ReactElement, useMemo } from "react";

import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "@/app/components/forms/finance/documents/documentsStructures";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { getDocumentIndexes } from "@/app/utils/documentFinancier.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { AjoutIdentificationFormValues } from "@/schemas/forms/ajout/ajoutIdentification.schema";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { FileItem } from "../../../_components/FileItem";
import { Year } from "../../../_components/Year";

export const DocumentsFinanciers = (): ReactElement => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<DocumentsFinanciersFlexibleFormValues>
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
                    localStorageValues?.documentsFinanciers?.[currentDocIndex]
                      ?.key
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
