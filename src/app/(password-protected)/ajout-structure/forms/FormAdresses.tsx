"use client";
import FormWrapper from "@/app/components/forms/FormWrapper";
import React, { useState, useEffect, useMemo } from "react";
import { AdressesSchema } from "../validation/validation";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import AddressWithValidation from "@/app/components/forms/AddressWithValidation";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { Repartition } from "@/types/adresse.type";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import AdressesList from "../[dnaCode]/02-adresses/AdressesList";

export default function FormAdresses() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const previousRoute = `/ajout-structure/${params.dnaCode}/01-identification`;
  const nextRoute = isEditMode
    ? `/ajout-structure/${params.dnaCode}/05-verification`
    : `/ajout-structure/${params.dnaCode}/03-type-places`;

  const hebergementsContainerRef = useRef(null);

  useEffect(() => {
    if (hebergementsContainerRef.current) {
      autoAnimate(hebergementsContainerRef.current);
    }
  }, [hebergementsContainerRef]);

  // Move defaultValues into useMemo to prevent recreation on every render
  const defaultValues = useMemo(
    () => ({
      nom: "",
      adresseAdministrative: "",
      codePostalAdministratif: "",
      communeAdministrative: "",
      departementAdministratif: "",
      typeBati: undefined,
    }),
    []
  );

  const { currentValue: localStorageValues } = useLocalStorage<
    typeof defaultValues
  >(`ajout-structure-${params.dnaCode}-adresses`, {} as typeof defaultValues);
  const mergedDefaultValues = useMemo(() => {
    if (!localStorageValues || Object.keys(localStorageValues).length === 0) {
      return defaultValues;
    }
    return {
      ...defaultValues,
      ...localStorageValues,
    };
  }, [localStorageValues, defaultValues]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  return (
    <FormWrapper
      schema={AdressesSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-adresses`}
      nextRoute={nextRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      submitButtonText={
        isEditMode ? "Modifier et revenir à la vérification" : "Étape suivante"
      }
    >
      {({ control, setValue, getValues, watch }) => {
        const typeBati = watch("typeBati") as Repartition | undefined;

        const handleTypeBatiChange = (value: string) => {
          if (
            value === Repartition.COLLECTIF ||
            value === undefined ||
            value === ""
          ) {
            // TODO: @ledjay mettre en place une confirmation avant de supprimer les adresses
            setValue("adresses", [], { shouldValidate: false });
          } else {
            const currentAdresses = getValues("adresses") || [];
            if (currentAdresses.length === 0) {
              setValue(
                "adresses",
                [
                  {
                    adresseComplete: "",
                    adresse: "",
                    codePostal: "",
                    commune: "",
                    departement: "",
                    repartition: value as Repartition,
                    places: 0,
                    logementSocial: false,
                    qpv: false,
                  },
                ],
                { shouldValidate: false }
              );
            } else {
              const currentAdresses = getValues("adresses") || [];

              const updatedAdresses = currentAdresses.map((adresse) => ({
                ...adresse,
                repartition: value as Repartition,
              }));

              setValue("adresses", updatedAdresses, {
                shouldValidate: false,
              });
            }
          }
        };

        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2 mb-8"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Étape précédente
            </Link>

            <Notice
              severity="info"
              title=""
              className="rounded [&_p]:flex  [&_p]:items-center"
              description="L’ensemble des adresses sont des données sensibles qui sont protégées selon les normes du gouvernement. Elles ne seront communiquées qu’aux agents et agentes de DDETS."
            />
            <fieldset className="flex flex-col gap-6">
              <legend className="text-xl font-bold mb-4 text-title-blue-france">
                Adresse administrative
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <InputWithValidation
                    name="nom"
                    control={control}
                    type="text"
                    label="Nom de la structure (optionnel)"
                    className="mb-0"
                  />
                  <span className="text-[#666666] text-sm">
                    ex. Les Coquelicots
                  </span>
                </div>
                <AddressWithValidation
                  control={control}
                  fullAddress="adresseAdministrativeComplete"
                  zipCode="codePostalAdministratif"
                  street="adresseAdministrative"
                  city="communeAdministrative"
                  department="departementAdministratif"
                  label="Adresse administrative"
                />

                <SelectWithValidation
                  name="typeBati"
                  control={control}
                  label="Type de bati"
                  onChange={handleTypeBatiChange}
                  required
                >
                  <option value="">Sélectionnez une option</option>

                  {Object.values(Repartition).map((repartition) => (
                    <option key={repartition} value={repartition}>
                      {repartition}
                    </option>
                  ))}
                </SelectWithValidation>
              </div>
            </fieldset>

            <div ref={hebergementsContainerRef}>
              {/* Only render on client-side and when condition is met */}
              {isInitialized &&
                typeBati !== undefined &&
                typeBati !== Repartition.COLLECTIF && (
                  <AdressesList
                    watch={watch}
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                  />
                )}
            </div>
          </>
        );
      }}
    </FormWrapper>
  );
}
