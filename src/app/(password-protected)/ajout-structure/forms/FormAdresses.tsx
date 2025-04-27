"use client";
import FormWrapper from "@/app/components/forms/FormWrapper";
import React, { useState, useEffect, useMemo } from "react";
import { AdressesSchema } from "../validation/validation";
import { useParams } from "next/navigation";
import Link from "next/link";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import AddressWithValidation from "@/app/components/forms/AddressWithValidation";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { Repartition } from "@/types/adresse.type";
import { AnimatePresence, motion } from "framer-motion";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Button from "@codegouvfr/react-dsfr/Button";

export default function FormAdresses() {
  const params = useParams();
  const previousRoute = `/ajout-structure/${params.dnaCode}/03-type-places`;

  // Move defaultValues into useMemo to prevent recreation on every render
  const defaultValues = useMemo(
    () => ({
      nom: "",
      adresseAdministrative: "",
      codePostalAdministratif: "",
      communeAdministrative: "",
      departementAdministratif: "",
      typeBatis: Repartition.DIFFUS,
      adresses: [
        {
          adresseComplete: "",
          adresse: "",
          codePostal: "",
          commune: "",
          departement: "",
          repartition: Repartition.DIFFUS,
          places: 0,
          typologies: [],
        },
      ],
    }),
    []
  );

  const { currentValue: localStorageValues } = useLocalStorage(
    `ajout-structure-${params.dnaCode}-adresses`,
    {}
  );

  // Merge defaultValues with localStorage values
  const mergedDefaultValues = useMemo(() => {
    if (!localStorageValues || Object.keys(localStorageValues).length === 0) {
      return defaultValues;
    }

    // Deep merge the default values with localStorage values
    return {
      ...defaultValues,
      ...localStorageValues,
      // Ensure adresses array exists and has at least one item
      adresses: localStorageValues.adresses?.length
        ? localStorageValues.adresses
        : defaultValues.adresses,
    };
  }, [localStorageValues, defaultValues]);

  const [showExtraFields, setShowExtraFields] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      console.log(localStorageValues);
      setShowExtraFields(
        localStorageValues.typeBatis === Repartition.COLLECTIF ||
          localStorageValues.typeBatis === Repartition.MIXTE
      );
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  return (
    <FormWrapper
      schema={AdressesSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-adresses`}
      nextRoute={previousRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
    >
      {({ control, setValue, getValues, watch }) => {
        // Use this to ensure the component re-renders when addresses change
        const addresses = watch("adresses") || [];

        const handleAddAddress = () => {
          const newAddress = {
            adresseComplete: "",
            adresse: "",
            codePostal: "",
            commune: "",
            departement: "",
            repartition: Repartition.DIFFUS,
            places: 0,
            typologies: [],
          };
          // Get current addresses from the form
          const currentAddresses = getValues("adresses") || [];
          // Add the new address
          const updatedAddresses = [...currentAddresses, newAddress];
          // Update the form state without triggering validation
          setValue("adresses", updatedAddresses, {
            shouldValidate: false,
          });
        };

        const handleRemoveAddress = (index: number) => {
          const currentAddresses = getValues("adresses") || [];
          const updatedAddresses = [...currentAddresses];
          updatedAddresses.splice(index, 1);
          setValue("adresses", updatedAddresses, {
            shouldValidate: false,
          });
        };

        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Étape précédente
            </Link>
            <fieldset className="flex flex-col gap-6">
              <legend className="text-xl font-bold mb-4 text-title-blue-france">
                Adresses
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
                  fullAddressName="adresseAdministrativeComplete"
                  zipCodeName="codePostalAdministratif"
                  streetName="adresseAdministrative"
                  cityName="communeAdministrative"
                  countyName="departementAdministratif"
                  label="Adresse administrative"
                />

                <SelectWithValidation
                  name="typeBatis"
                  control={control}
                  label="Type de batis"
                  onChange={(value) => {
                    setShowExtraFields(
                      value === "Collectif" || value === "Mixte"
                    );
                  }}
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
            <AnimatePresence>
              {showExtraFields && (
                <motion.div
                  initial={{ height: 0, overflow: "hidden" }}
                  animate={{ height: "auto", overflow: "visible" }}
                  exit={{ height: 0, overflow: "hidden" }}
                  transition={{
                    height: {
                      duration: 0.25,
                      type: "tween",
                      ease: "circOut",
                    },
                    overflow: {
                      delay: 0.25,
                      type: "tween",
                      ease: "circOut",
                    },
                  }}
                >
                  <hr />
                  <fieldset className="flex flex-col gap-6">
                    <legend className="text-xl font-bold mb-4 text-title-blue-france">
                      Hébergements
                    </legend>
                    <div className="flex flex-col gap-2">
                      <p className="mb-1">
                        Veuillez renseigner l’ensemble des adresses
                        d’hébergement de la structure. <br />
                        Vous pouvez le faire directement en remplissant les
                        champs ci-dessous ou vous pouvez compléter notre modèle
                        à télécharger depuis un logiciel tableur, l’importer
                        puis vérifier le remplissage automatique des champs qui
                        s’opérera.
                      </p>
                      <div className="flex flex-col gap-2">
                        <p className="text-action-high-blue-france font-bold mb-0">
                          Liste des hébergements (d’après notre modèle à
                          télécharger uniquement)
                        </p>
                        <div className="flex flex-col gap-1 bg-alt-blue-france p-4 rounded">
                          <input type="file" className="border bg-white" />
                          <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="multiple_files"
                            type="file"
                            multiple
                          />
                        </div>
                      </div>
                    </div>
                    <Notice
                      severity="info"
                      title="Pour le champ “places”,"
                      description="veuillez renseigner le nombre de places autorisées total pour l’adresse correspondante."
                    />
                    <Notice
                      severity="info"
                      title=""
                      description={
                        <>
                          Vous pouvez vérifier si une adresse fait partie d{"'"}
                          un Quartier Prioritaire de la politique de la Ville
                          (QPV){" "}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://sig.ville.gouv.fr/"
                            className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2"
                          >
                            sur ce lien.
                          </a>
                        </>
                      }
                    />

                    {addresses.map((address, index) => (
                      <div
                        className="flex max-sm:flex-col gap-6"
                        key={`address-${index}`}
                      >
                        <AddressWithValidation
                          control={control}
                          fullAddressName={`adresses.${index}.adresseComplete`}
                          zipCodeName={`adresses.${index}.codePostal`}
                          streetName={`adresses.${index}.adresse`}
                          countyName={`adresses.${index}.departement`}
                          cityName={`adresses.${index}.commune`}
                          label="Adresse"
                          className="w-1/3"
                        />
                        <InputWithValidation
                          name={`adresses.${index}.places`}
                          control={control}
                          type="number"
                          label="Places"
                          className="w-1/12 mb-0"
                        />
                        <SelectWithValidation
                          name={`adresses.${index}.repartition`}
                          control={control}
                          label="Type de batis"
                          required
                        >
                          <option value="">Sélectionnez une option</option>
                          {Object.values(Repartition).map((repartition) => (
                            <option key={repartition} value={repartition}>
                              {repartition}
                            </option>
                          ))}
                        </SelectWithValidation>
                        <div className="flex grow flex-col gap-2">
                          <label htmlFor={`adresses.${index}.typologies`}>
                            Particularités
                          </label>
                          <div className="flex w-full gap-4 items-center min-h-[2.6rem]">
                            <Checkbox
                              options={[
                                {
                                  label: "Logement social",
                                  nativeInputProps: {
                                    name: `adresses.${index}.typologies`,
                                    value: "logementSocial",
                                  },
                                },
                              ]}
                            />
                            <Checkbox
                              options={[
                                {
                                  label: "QPV",
                                  nativeInputProps: {
                                    name: `adresses.${index}.typologies`,
                                    value: "qpv",
                                  },
                                },
                              ]}
                            />
                            {index !== 0 && (
                              <Button
                                iconId="fr-icon-delete-line"
                                className="ml-auto rounded-4xl"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveAddress(index);
                                }}
                                priority="tertiary no outline"
                                title="Label button"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddAddress();
                      }}
                      className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2"
                    >
                      + Ajouter un hébergement
                    </button>
                  </fieldset>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </FormWrapper>
  );
}
