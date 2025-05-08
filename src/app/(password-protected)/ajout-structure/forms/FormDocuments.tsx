"use client";
import { PropsWithChildren, ReactElement, useMemo, useState } from "react";
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
import Upload from "@/app/components/forms/Upload";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";

export default function FormDocuments() {
  const params = useParams();
  const previousRoute = `/ajout-structure/${params.dnaCode}/03-type-places`;

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
      key={less5Years ? "schema-flexible" : "schema-strict"} // 🔑 force un remount
      schema={selectedSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-documents`}
      nextRoute={previousRoute}
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
              Étape précédente
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
                  onChange={(v) => {
                    onChange(v);
                    handle5YearsChange(v);
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
                <UploadItem title={`Projet de budget pour ${year}`}>
                  <UploadWithValidation
                    name={`${year}.budgetProjet`}
                    control={control}
                    label="huhu"
                  />
                </UploadItem>
                <UploadItem title={`Budget rectificatif ${year}`}>
                  <Upload />
                </UploadItem>
                {year !== "2025" && (
                  <>
                    <UploadItem title={`Compte administratif pour  ${year}`}>
                      <Upload name="" />
                    </UploadItem>
                    <UploadItem title="Rapport d’activité">
                      <Upload name="" />
                    </UploadItem>
                    <UploadItem title="Rapport budgétaire">
                      <Upload name="" />
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

type YearProps = PropsWithChildren & {
  year: string;
};

const Year = ({ children, year }: YearProps): ReactElement => {
  return (
    <fieldset className="flex flex-col gap-4 border-default-grey border-b pb-8 mb-6">
      <h2 className="text-title-blue-france text-xl mb-0">{year}</h2>
      <p className="text-disabled-grey mb-0 text-xs">
        Taille maximale par fichier : 10 Mo. Formats supportés : pdf, xls, xlsx,
        csv et ods.
      </p>
      <div className="grid grid-cols-3 gap-10">{children}</div>
    </fieldset>
  );
};

type UploadItemProps = PropsWithChildren & {
  title: string;
};

const UploadItem = ({ children, title }: UploadItemProps): ReactElement => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-blue-france text-sm font-medium mb-0 ">
        {title}
      </h3>
      {children}
    </div>
  );
};
