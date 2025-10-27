"use client";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { getDocumentIndexes } from "@/app/utils/buildFileUploadsDefaultValues.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { AjoutIdentificationFormValues } from "@/schemas/forms/ajout/ajoutIdentification.schema";
import {
  DocumentsFinanciersFlexibleSchema,
  DocumentsFinanciersStrictSchema,
} from "@/schemas/forms/base/documentsFinanciers.schema";

import { DocumentItem } from "../[dnaCode]/04-documents/DocumentItem";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "../[dnaCode]/04-documents/documents";
import { Year } from "../components/Year";

export default function FormDocuments() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const previousRoute = `/ajout-structure/${params.dnaCode}/03-type-places`;
  const resetRoute = `/ajout-structure/${params.dnaCode}/01-identification`;
  const nextRoute = `/ajout-structure/${params.dnaCode}/05-verification`;

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
    () =>
      less5Years
        ? DocumentsFinanciersFlexibleSchema
        : DocumentsFinanciersStrictSchema,
    [less5Years]
  );

  const handle5YearsChange = (checked: boolean) => {
    setLess5Years(checked);
    updateLocalStorageValues({
      ...localStorageValues,
      less5Years: checked,
    });
  };

  const { currentValue } = useLocalStorage<
    Partial<AjoutIdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const isAutorisee = isStructureAutorisee(currentValue?.type);

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  // TODO : à refacto avec un système d'années n-1, n-2, etc
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

  // TODO : refacto input hidden pour ne pas injecter les valeurs en l'absence de file upload
  return (
    <FormWrapper
      key={less5Years ? "schema-flexible" : "schema-strict"}
      schema={selectedSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-documents`}
      nextRoute={nextRoute}
      resetRoute={resetRoute}
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
                        "Ma structure a moins de 5 ans d’existence sur le programme 303, je ne peux fournir que certaines années demandées.",
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
                    const todayYear = new Date().getFullYear();
                    if (Number(year) <= todayYear - document.yearIndex) {
                      const documentKey = `${document.value}-${year}`;
                      const currentDocIndex = documentIndexes[documentKey];
                      return (
                        <DocumentItem
                          key={`${document.value}-${year}`}
                          year={year}
                          control={control}
                          index={currentDocIndex}
                          register={register}
                          categoryLabel={document.label}
                          categorySubLabel={document.subLabel}
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
