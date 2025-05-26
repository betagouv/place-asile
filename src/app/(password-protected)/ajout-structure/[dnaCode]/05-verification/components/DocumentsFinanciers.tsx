import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { DocumentsSchemaFlexible } from "../../../validation/validation";
import { useParams } from "next/navigation";
import { z } from "zod";
import { ReactElement, useMemo } from "react";
import { Year } from "../../../components/Year";
import { FileItem } from "../../../components/FileItem";

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
  // TODO : utiliser les fichiers de conventionné/autorisé
  return (
    <>
      {years.map((year, index) => (
        <Year key={year} year={year}>
          <FileItem
            title={`Projet de budget pour ${year}`}
            fileKey={localStorageValues?.fileUploads?.[index]?.key}
          />

          <FileItem
            title={`Budget rectificatif ${year}`}
            fileKey={localStorageValues?.fileUploads?.[index]?.key}
          />
          {year !== "2025" && (
            <>
              <FileItem
                title={`Compte administratif pour ${year}`}
                fileKey={localStorageValues?.fileUploads?.[index]?.key}
              />
              <FileItem
                title="Rapport d'activité"
                fileKey={localStorageValues?.fileUploads?.[index]?.key}
              />
              <FileItem
                title="Rapport budgétaire"
                fileKey={localStorageValues?.fileUploads?.[index]?.key}
              />
            </>
          )}
        </Year>
      ))}
    </>
  );
};
