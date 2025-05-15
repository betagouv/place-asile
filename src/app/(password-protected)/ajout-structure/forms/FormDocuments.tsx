"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Controller } from "react-hook-form";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import {
  DocumentsSchemaStrict,
  DocumentsSchemaFlexible,
} from "../validation/validation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { Year } from "../components/Year";
import { UploadItem } from "../components/UploadItem";

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

  // État local pour refléter le switch
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

  return (
    <FormWrapper
      // ⚠ La clé permet de forcer un remount du formulaire pour que le changement de schema soit pris en compte
      key={less5Years ? "schema-flexible" : "schema-strict"}
      schema={selectedSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-documents`}
      nextRoute={nextRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      className="gap-0"
    >
      {({ control }) => {
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
              render={({ field: { onChange, value, name } }) => (
                <ToggleSwitch
                  label="Ma structure a moins de 5 ans d’existence sur le programme 303."
                  checked={value}
                  onChange={(value) => {
                    onChange(value);
                    handle5YearsChange(value);
                  }}
                  name={name}
                  className="w-fit mb-8"
                  labelPosition="left"
                  showCheckedHint={false}
                />
              )}
            />

            {years.map((year) => (
              <Year key={year} year={year}>
                <p className="text-disabled-grey mb-0 text-xs col-span-3">
                  Taille maximale par fichier : 10 Mo. Formats supportés : pdf,
                  xls, xlsx, csv et ods.
                </p>
                <UploadItem title={`Projet de budget pour ${year}`}>
                  <UploadWithValidation
                    name={`${year}.budgetProjet`}
                    control={control}
                  />
                </UploadItem>
                <UploadItem title={`Budget rectificatif ${year}`}>
                  <UploadWithValidation
                    name={`${year}.budgetRectificatif`}
                    control={control}
                  />
                </UploadItem>
                {year !== "2025" && (
                  <>
                    <UploadItem title={`Compte administratif pour  ${year}`}>
                      <UploadWithValidation
                        name={`${year}.compteAdministratif`}
                        control={control}
                      />
                    </UploadItem>
                    <UploadItem title="Rapport d’activité">
                      <UploadWithValidation
                        name={`${year}.rapportActivite`}
                        control={control}
                      />
                    </UploadItem>
                    <UploadItem title="Rapport budgétaire">
                      <UploadWithValidation
                        name={`${year}.rapportBudgetaire`}
                        control={control}
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
