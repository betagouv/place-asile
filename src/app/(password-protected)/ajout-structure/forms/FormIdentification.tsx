"use client";
// TODO @ledjay : split this file for code clarity
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useEffect, useState, useRef } from "react";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { PublicType, StructureType } from "@/types/structure.type";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useParams } from "next/navigation";
import { IdentificationSchema } from "@/app/(password-protected)/ajout-structure/validation/validation";
import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import { z } from "zod";

type IdentificationFormValues = z.infer<typeof IdentificationSchema>;

export default function FormIdentification() {
  const params = useParams();
  const nextRoute = `/ajout-structure/${params.dnaCode}/02-adresses`;
  const filialesContainerRef = useRef(null);

  useEffect(() => {
    if (filialesContainerRef.current) {
      autoAnimate(filialesContainerRef.current);
    }
  }, [filialesContainerRef]);

  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<IdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  // Initialize with default values to ensure inputs are always controlled
  const [isManagedByAFiliale, setIsManagedByAFiliale] = useState(false);
  const [hasCPOM, setHasCPOM] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      setIsManagedByAFiliale(!!localStorageValues.filiale);
      setHasCPOM(!!localStorageValues.debutCpom);
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  return (
    <FormWrapper
      schema={IdentificationSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-identification`}
      nextRoute={nextRoute}
      mode="onBlur"
    >
      {({ register, control }) => (
        <>
          <fieldset className="flex flex-col gap-6">
            <legend className="text-xl font-bold mb-4 text-title-blue-france">
              Description
            </legend>

            <input
              type="hidden"
              {...register("dnaCode")}
              defaultValue={params.dnaCode}
            />
            <Checkbox
              options={[
                {
                  label: "Cette structure est gérée par une filiale.",
                  nativeInputProps: {
                    name: "managed-by-a-filiale",
                    checked: isManagedByAFiliale,
                    onChange: (e) => {
                      setIsManagedByAFiliale(e.target.checked);
                    },
                  },
                },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectWithValidation
                name="type"
                control={control}
                label="Type"
                required
              >
                <option value="">Sélectionnez un type</option>
                {Object.values(StructureType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectWithValidation>

              <InputWithValidation
                name="operateur"
                control={control}
                type="text"
                label="Opérateur"
              />

              <div ref={filialesContainerRef}>
                {isManagedByAFiliale && (
                  <InputWithValidation
                    name="filiale"
                    control={control}
                    type="text"
                    label="Filiale"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWithValidation
                name="creationDate"
                control={control}
                type="date"
                label="Date de création"
              />
              <InputWithValidation
                name="finessCode"
                control={control}
                type="text"
                label="Code FINESS"
              />
              <SelectWithValidation
                name="public"
                control={control}
                label="Public"
              >
                <option value="">Sélectionnez un public</option>
                {Object.values(PublicType).map((publicType) => (
                  <option key={publicType} value={publicType}>
                    {publicType}
                  </option>
                ))}
              </SelectWithValidation>
            </div>

            <ToggleSwitch
              inputTitle="CPOM"
              label="Actuellement, la structure fait-elle partie d’un CPOM ?"
              labelPosition="left"
              showCheckedHint={false}
              className="w-fit"
              checked={hasCPOM}
              onChange={setHasCPOM}
            />

            <label className="flex gap-6">
              Actuellement, la structure dispose-t-elle de places spécalisées /
              labelisées ?
              <Checkbox
                options={[
                  {
                    label: "LGBT",
                    nativeInputProps: {
                      ...register("lgbt"),
                    },
                  },
                ]}
              />
              <Checkbox
                options={[
                  {
                    label: "FVV et TEH",
                    nativeInputProps: {
                      ...register("fvvTeh"),
                    },
                  },
                ]}
              />
            </label>
          </fieldset>

          <hr />

          <h2 className="text-xl font-bold mb-0 text-title-blue-france">
            Contacts
          </h2>
          <fieldset className="flex flex-col gap-6">
            <legend className="text-lg font-bold mb-4 text-title-blue-france">
              Contact principal
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWithValidation
                name="contactPrincipal.prenom"
                control={control}
                type="text"
                label="Prénom"
              />
              <InputWithValidation
                name="contactPrincipal.nom"
                control={control}
                type="text"
                label="Nom"
              />
              <InputWithValidation
                name="contactPrincipal.role"
                control={control}
                type="text"
                label="Fonction"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWithValidation
                name="contactPrincipal.email"
                control={control}
                type="email"
                label="Email"
              />
              <InputWithValidation
                name="contactPrincipal.telephone"
                control={control}
                type="tel"
                label="Téléphone"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-6">
            <legend className="text-lg font-bold mb-4 text-title-blue-france">
              Contact secondaire
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWithValidation
                name="contactSecondaire.prenom"
                control={control}
                type="text"
                label="Prénom"
              />
              <InputWithValidation
                name="contactSecondaire.nom"
                control={control}
                type="text"
                label="Nom"
              />
              <InputWithValidation
                name="contactSecondaire.role"
                control={control}
                type="text"
                label="Fonction"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWithValidation
                name="contactSecondaire.email"
                control={control}
                type="email"
                label="Email"
              />
              <InputWithValidation
                name="contactSecondaire.telephone"
                control={control}
                type="tel"
                label="Téléphone"
              />
            </div>
          </fieldset>

          <hr />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-4 text-title-blue-france">
              Calendrier
            </h2>
            <fieldset className="flex flex-col gap-6">
              <legend className="text-lg font-bold mb-2 text-title-blue-france">
                Période d’autorisation en cours
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                <InputWithValidation
                  name="debutPeriodeAutorisation"
                  control={control}
                  type="date"
                  label="Date de début"
                />

                <InputWithValidation
                  name="finPeriodeAutorisation"
                  control={control}
                  type="date"
                  label="Date de fin"
                />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-6">
              <legend className="text-lg font-bold mb-2 text-title-blue-france">
                Convention en cours
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                <InputWithValidation
                  name="debutConvention"
                  control={control}
                  type="date"
                  label="Date de début"
                />

                <InputWithValidation
                  name="finConvention"
                  control={control}
                  type="date"
                  label="Date de fin"
                />
              </div>
            </fieldset>

            {hasCPOM && (
              <fieldset className="flex flex-col gap-6">
                <legend className="text-lg font-bold mb-2 text-title-blue-france">
                  CPOM en cours
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                  <InputWithValidation
                    name="debutCpom"
                    control={control}
                    type="date"
                    label="Date de début"
                  />

                  <InputWithValidation
                    name="finCpom"
                    control={control}
                    type="date"
                    label="Date de fin"
                  />
                </div>
              </fieldset>
            )}
          </div>
        </>
      )}
    </FormWrapper>
  );
}
