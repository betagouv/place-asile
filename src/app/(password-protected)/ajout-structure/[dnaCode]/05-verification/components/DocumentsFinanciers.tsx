import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { DocumentsSchemaFlexible } from "../../../validation/validation";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useMemo } from "react";
import { Year } from "../../../components/Year";
import { FileItem } from "../../../components/FileItem";

type DocumentsFinanciersFormValues = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsFinanciers = () => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<DocumentsFinanciersFormValues>
  >(`ajout-structure-${params.dnaCode}-documents`, {});

  const years = useMemo(
    () => ["2025", "2024", "2023", "2022", "2021"] as const,
    []
  );

  // TODO: handle FileItems data from localStorage or API ?
  return (
    <>
      {years.map((year) => (
        <Year key={year} year={year}>
          <FileItem
            title={`Projet de budget pour ${year}`}
            file={
              localStorageValues?.[year]?.budgetProjet
                ? { name: localStorageValues[year]?.budgetProjet, size: 0 }
                : undefined
            }
          />

          <FileItem
            title={`Budget rectificatif ${year}`}
            file={
              localStorageValues?.[year]?.budgetRectificatif
                ? {
                    name: localStorageValues[year]?.budgetRectificatif,
                    size: 0,
                  }
                : undefined
            }
          />
          {year !== "2025" && (
            <>
              <FileItem
                title={`Compte administratif pour ${year}`}
                file={
                  localStorageValues?.[year]?.compteAdministratif
                    ? {
                        name: localStorageValues[year]?.compteAdministratif,
                        size: 0,
                      }
                    : undefined
                }
              />
              <FileItem
                title="Rapport d'activité"
                file={
                  localStorageValues?.[year]?.rapportActivite
                    ? {
                        name: localStorageValues[year]?.rapportActivite,
                        size: 0,
                      }
                    : undefined
                }
              />
              <FileItem
                title="Rapport budgétaire"
                file={
                  localStorageValues?.[year]?.rapportBudgetaire
                    ? {
                        name: localStorageValues[year]?.rapportBudgetaire,
                        size: 0,
                      }
                    : undefined
                }
              />
            </>
          )}
        </Year>
      ))}
    </>
  );
};
