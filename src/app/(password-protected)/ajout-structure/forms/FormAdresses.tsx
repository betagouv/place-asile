"use client";
import FormWrapper from "@/app/components/forms/FormWrapper";
import React, { useState, useEffect } from "react";
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

export default function FormAdresses() {
  const params = useParams();
  const previousRoute = `/ajout-structure/${params.dnaCode}/03-type-places`;

  const { currentValue: localStorageValues } = useLocalStorage(
    "ajout-structure-adresses",
    {}
  );

  const [typeBatis, setTypeBatis] = useState(
    localStorageValues?.typeBatis || false
  );
  const [showExtraFields, setShowExtraFields] = useState(false);

  useEffect(() => {
    setShowExtraFields(typeBatis === "Collectif" || typeBatis === "Mixte");
  }, [typeBatis]);

  console.log(typeBatis);

  return (
    <FormWrapper
      schema={AdressesSchema}
      localStorageKey="ajout-structure-adresses"
      nextRoute={previousRoute}
      mode="onBlur"
      defaultValues={{
        adresses: [
          {
            adresse: "",
            codePostal: "",
            commune: "",
            repartition: Repartition.DIFFUS,
            places: 0,
            typologies: [],
          },
        ],
      }}
    >
      {({ control }) => (
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
                fullAddressName="adresses[0].adresseAdministrativeComplete"
                zipCodeName="adresses[0].codePostalAdministratif"
                streetName="adresses[0].adresseAdministrative"
                cityName="adresses[0].communeAdministrative"
                countyName="adresses[0].departementAdministratif"
                label="Adresse administrative"
              />

              <SelectWithValidation
                name="typeBatis"
                control={control}
                label="Type de batis"
                onChange={(value) => {
                  setTypeBatis(value);
                }}
                required
              >
                <option value="">Sélectionnez une option</option>
                {Object.values(Repartition).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectWithValidation>
            </div>
          </fieldset>
          <AnimatePresence>
            {showExtraFields && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{
                  duration: 0.25,
                  type: "tween",
                  ease: "circOut",
                }}
                className="overflow-hidden"
              >
                <hr />
                <fieldset className="flex flex-col gap-6">
                  <legend className="text-xl font-bold mb-4 text-title-blue-france">
                    Hébergements
                  </legend>
                  <div className="flex flex-col gap-2">
                    <p className="mb-1">
                      Veuillez renseigner l’ensemble des adresses d’hébergement
                      de la structure. <br />
                      Vous pouvez le faire directement en remplissant les champs
                      ci-dessous ou vous pouvez compléter notre modèle à
                      télécharger depuis un logiciel tableur, l’importer puis
                      vérifier le remplissage automatique des champs qui
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
                        Vous pouvez vérifier si une adresse fait partie d{"'"}un
                        Quartier Prioritaire de la politique de la Ville (QPV){" "}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AddressWithValidation
                      control={control}
                      fullAddressName="adresses[0].adresseAdministrativeComplete"
                      zipCodeName="adresses[0].codePostalAdministratif"
                      streetName="adresses[0].adresseAdministrative"
                      cityName="adresses[0].communeAdministrative"
                      countyName="adresses[0].departementAdministratif"
                      label="Adresse"
                    />
                  </div>
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </FormWrapper>
  );
}
