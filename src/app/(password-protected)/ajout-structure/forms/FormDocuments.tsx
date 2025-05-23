"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import {
  DocumentsSchemaStrict,
  DocumentsSchemaFlexible,
  IdentificationFormValues,
} from "../validation/validation";
import { Year } from "../components/Year";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { DocumentItem } from "../[dnaCode]/04-documents/DocumentItem";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "../[dnaCode]/04-documents/documents";

export default function FormDocuments() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const previousRoute = `/ajout-structure/${params.dnaCode}/03-type-places`;

  const nextRoute = `/ajout-structure/${params.dnaCode}/05-verification`;

  const years = useMemo(
    () => ["2025", "2024", "2023", "2022", "2021"] as const,
    []
  );

  const {
    currentValue: localStorageValues,
    updateLocalStorageValue: updateLocalStorageValues,
  } = useLocalStorage(`ajout-structure-${params.dnaCode}-documents`, {
    less5Years: false,
  });

  const mergedDefaultValues = useMemo(() => {
    return localStorageValues || { less5Years: false };
  }, [localStorageValues]);

  const [less5Years, setLess5Years] = useState(
    mergedDefaultValues?.less5Years || false
  );

  const selectedSchema = useMemo(
    () => (less5Years ? DocumentsSchemaFlexible : DocumentsSchemaStrict),
    [less5Years]
  );

  const handle5YearsChange = (checked: boolean) => {
    setLess5Years(checked);
    updateLocalStorageValues({
      ...localStorageValues,
      less5Years: checked,
    });
  };

  const { currentValue } = useLocalStorage<Partial<IdentificationFormValues>>(
    `ajout-structure-${params.dnaCode}-identification`,
    {}
  );

  const documents = isStructureAutorisee(currentValue?.type)
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  // Pre-calculate document indices to handle re-renders properly
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

  // TODO : refacto input hidden pour ne pas injecter les valeurs en l'absence de file upload
  // TODO : changer le nom des documents à uploader pour les structures subventionnées/autorisées
  return (
    <FormWrapper
      // ⚠ La clé permet de forcer un remount du formulaire pour que le changement de schema soit pris en compte
      key={less5Years ? "schema-flexible" : "schema-strict"}
      schema={selectedSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-documents`}
      nextRoute={nextRoute}
      mode="onChange"
      defaultValues={mergedDefaultValues}
      className="gap-0"
      submitButtonText={
        isEditMode ? "Modifier et revenir à la vérification" : "Vérifier"
      }
    >
      {({ control, register }) => {
        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2 mb-8"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Etape précédente
            </Link>

            <p>
              Veuillez importer les documents financiers demandés concernant les
              cinq dernières années.
            </p>

            <Controller
              control={control}
              name="less5Years"
              defaultValue={less5Years}
              render={({ field }) => (
                <Checkbox
                  className="mb-8"
                  options={[
                    {
                      label:
                        "Ma structure a moins de 5 ans d’existence sur le programme 303, je ne peux pas fournir autant d’historique.",
                      nativeInputProps: {
                        name: field.name,
                        checked: field.value,
                        onChange: (e) => {
                          field.onChange(e.target.checked);
                          handle5YearsChange(e.target.checked);
                        },
                      },
                    },
                  ]}
                />
              )}
            />

            {years.map((year) => {
              // Use the same counter across all years
              return (
                <Year key={year} year={year}>
                  <p className="text-disabled-grey mb-0 text-xs col-span-3">
                    Taille maximale par fichier : 10 Mo. Formats supportés :
                    pdf, xls, xlsx, csv et ods.
                    <br />
                    Votre fichier est trop lourd ?{" "}
                    <a
                      target="_blank"
                      className="underline"
                      rel="noopener noreferrer"
                      href="https://stirling-pdf.framalab.org/compress-pdf?lang=fr_FR"
                    >
                      Compressez-le
                    </a>
                    .
                  </p>
                  {documents.map((document) => {
                    const currentYear = new Date().getFullYear().toString();
                    if (
                      (currentYear === "2025" && document.currentYear) ||
                      year !== currentYear
                    ) {
                      const documentKey = `${document.value}-${year}`;
                      const currentDocIndex = documentIndices[documentKey];
                      return (
                        <DocumentItem
                          key={`${document.value}-${year}`}
                          year={year}
                          control={control}
                          index={currentDocIndex}
                          register={register}
                          categoryLabel={document.label}
                          categoryValue={document.value}
                        />
                      );
                    }
                    return null;
                  })}
                </Year>
              );
            })}
          </>
        );
      }}
    </FormWrapper>
  );
}
