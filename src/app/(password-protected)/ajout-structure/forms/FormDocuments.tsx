"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Controller } from "react-hook-form";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import {
  DocumentsSchemaStrict,
  DocumentsSchemaFlexible,
} from "../validation/validation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { Year } from "../components/Year";
import { UploadItem } from "../components/UploadItem";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { getYearDate } from "@/app/utils/date.util";

export default function FormDocuments() {
  const params = useParams();
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

  // TODO : refacto input hidden pour ne pas injecter les valeurs en l'absence de file upload
  return (
    <FormWrapper
      // ⚠ La clé permet de forcer un remount du formulaire pour que le changement de schema soit pris en compte
      key={less5Years ? "schema-flexible" : "schema-strict"}
      schema={selectedSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-documents`}
      nextRoute={nextRoute}
      mode="onTouched"
      defaultValues={mergedDefaultValues}
      className="gap-0"
      submitButtonText="Vérifier"
    >
      {({ control, register }) => {
        console.log("selectedSchema", selectedSchema);

        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2 mb-8"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Revenir au formulaire
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

            {years.map((year, index) => (
              <Year key={year} year={year}>
                <p className="text-disabled-grey mb-0 text-xs col-span-3">
                  Taille maximale par fichier : 10 Mo. Formats supportés : pdf,
                  xls, xlsx, csv et ods.
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

                <UploadItem title={`Projet de budget pour ${year}`}>
                  <UploadWithValidation
                    name={`fileUploads.${index}.key`}
                    control={control}
                  />
                  <input
                    type="hidden"
                    aria-hidden="true"
                    defaultValue={"projetBudget"}
                    {...register(`fileUploads.${index}.category`)}
                  />
                  <input
                    type="hidden"
                    aria-hidden="true"
                    defaultValue={getYearDate(year)}
                    {...register(`fileUploads.${index}.date`)}
                  />
                </UploadItem>
                <UploadItem title={`Budget rectificatif ${year}`}>
                  <UploadWithValidation
                    name={`fileUploads.${index}.key`}
                    control={control}
                  />
                  <input
                    type="hidden"
                    aria-hidden="true"
                    defaultValue={"budgetRectificatif"}
                    {...register(`fileUploads.${index}.category`)}
                  />
                  <input
                    type="hidden"
                    aria-hidden="true"
                    defaultValue={getYearDate(year)}
                    {...register(`fileUploads.${index}.date`)}
                  />
                </UploadItem>
                {year !== "2025" && (
                  <>
                    <UploadItem title={`Compte administratif pour  ${year}`}>
                      <UploadWithValidation
                        name={`fileUploads.${index}.key`}
                        control={control}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={"compteAdministratif"}
                        {...register(`fileUploads.${index}.category`)}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={getYearDate(year)}
                        {...register(`fileUploads.${index}.date`)}
                      />
                    </UploadItem>
                    <UploadItem title="Rapport d’activité">
                      <UploadWithValidation
                        name={`fileUploads.${index}.key`}
                        control={control}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={"rapportActivite"}
                        {...register(`fileUploads.${index}.category`)}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={getYearDate(year)}
                        {...register(`fileUploads.${index}.date`)}
                      />
                    </UploadItem>
                    <UploadItem title="Rapport budgétaire">
                      <UploadWithValidation
                        name={`fileUploads.${index}.key`}
                        control={control}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={"rapportBudgetaire"}
                        {...register(`fileUploads.${index}.category`)}
                      />
                      <input
                        type="hidden"
                        aria-hidden="true"
                        defaultValue={getYearDate(year)}
                        {...register(`fileUploads.${index}.date`)}
                      />
                    </UploadItem>
                  </>
                )}
              </Year>
            ))}
          </>
        );
      }}
    </FormWrapper>
  );
}
