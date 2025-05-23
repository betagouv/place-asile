"use client";
// TODO @ledjay : split this file for code clarity
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useEffect, useState, useRef } from "react";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { PublicType, StructureType } from "@/types/structure.type";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useParams } from "next/navigation";
import {
  IdentificationFormValues,
  IdentificationSchema,
} from "@/app/(password-protected)/ajout-structure/validation/validation";
import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import Notice from "@codegouvfr/react-dsfr/Notice";

export default function FormIdentification() {
  const params = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const isEditMode = searchParams.get("mode") === "edit";

  const nextRoute = isEditMode
    ? `/ajout-structure/${params.dnaCode}/05-verification`
    : `/ajout-structure/${params.dnaCode}/02-adresses`;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [type, setType] = useState<string | undefined>(
    localStorageValues?.type
  );

  const isStructureAutorisee =
    type === StructureType.CADA || type === StructureType.CPH;

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      setIsManagedByAFiliale(!!localStorageValues.filiale);
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  return (
    <FormWrapper
      schema={IdentificationSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-identification`}
      nextRoute={nextRoute}
      mode="onBlur"
      submitButtonText={
        isEditMode ? "Modifier et revenir à la vérification" : "Étape suivante"
      }
    >
      {({ register, control, watch, setValue }) => {
        const cpom = watch("cpom");

        return (
          <>
            <Notice
              severity="warning"
              title=""
              className="rounded [&_p]:flex  [&_p]:items-center"
              description={
                <span className="text-default-grey">
                  Si votre structure regroupe plusieurs codes DNA mais est une
                  seule entité juridique et/ou financière, veuillez ne pas
                  remplir ce formulaire et nous contacter directement par email
                  via{" "}
                  {
                    <a
                      href="mailto:placedasile@beta.gouv.fr"
                      className="underline"
                    >
                      placedasile@beta.gouv.fr
                    </a>
                  }
                  .
                </span>
              }
            />
            <fieldset className="flex flex-col gap-6">
              <legend className="text-xl font-bold mb-10 text-title-blue-france">
                Description
              </legend>

              <input
                type="hidden"
                {...register("dnaCode")}
                defaultValue={params.dnaCode}
              />

              <ToggleSwitch
                label="Cette structure est-elle gérée par une filiale d’opérateur (ex: YSOS, filiale d’Adoma) ?"
                labelPosition="left"
                showCheckedHint={true}
                className="w-fit [&_label]:gap-2"
                checked={isManagedByAFiliale}
                name="managed-by-a-filiale"
                onChange={() => setIsManagedByAFiliale(!isManagedByAFiliale)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectWithValidation
                  name="type"
                  control={control}
                  label="Type"
                  required
                  onChange={(event) => setType(event)}
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
                {isStructureAutorisee && (
                  <InputWithValidation
                    name="finessCode"
                    control={control}
                    type="text"
                    label="Code FINESS"
                  />
                )}
                <SelectWithValidation
                  name="public"
                  control={control}
                  label="Public"
                >
                  <option value="">Sélectionnez une option</option>
                  {Object.values(PublicType).map((publicType) => (
                    <option key={publicType} value={publicType}>
                      {publicType}
                    </option>
                  ))}
                </SelectWithValidation>
              </div>

              <label className="flex gap-6">
                Actuellement, la structure dispose-t-elle de places spécalisées
                / labelisées ?
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

              <ToggleSwitch
                inputTitle="CPOM"
                label="Actuellement, la structure fait-elle partie d’un CPOM ?"
                labelPosition="left"
                showCheckedHint={false}
                className="w-fit"
                checked={cpom ? true : false}
                onChange={(event) => setValue("cpom", event)}
              />
            </fieldset>

            <hr />

            <h2 className="text-xl font-bold mb-0 text-title-blue-france">
              Contacts
            </h2>

            <Notice
              severity="info"
              title=""
              className="rounded [&_p]:flex [&_p]:items-center"
              description="Veuillez renseigner en contact principal la personne responsable de la structure et en contact secondaire la personne responsable de l’opérationnel et/ou financier."
            />

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
              {isStructureAutorisee && (
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
              )}

              <fieldset className="flex flex-col gap-6">
                <legend className="text-lg font-bold mb-2 text-title-blue-france">
                  Convention en cours (optionnel)
                </legend>
                <Notice
                  severity="info"
                  title=""
                  className="rounded [&_p]:flex  [&_p]:items-center"
                  description="Uniquement si votre structure a fait l’objet d’une convention."
                />
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

              {cpom && (
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
        );
      }}
    </FormWrapper>
  );
}
