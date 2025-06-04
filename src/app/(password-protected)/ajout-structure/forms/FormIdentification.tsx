"use client";
// TODO @ledjay : split this file for code clarity
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useEffect, useState, useRef, useMemo } from "react";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { PublicType, StructureType } from "@/types/structure.type";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useParams, useSearchParams } from "next/navigation";
import {
  IdentificationFormValues,
  IdentificationSchema,
} from "@/app/(password-protected)/ajout-structure/validation/validation";
import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { isStructureSubventionnee } from "@/app/utils/structure.util";

export default function FormIdentification() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const resetRoute = `/ajout-structure/${params.dnaCode}/01-identification`;
  const nextRoute = isEditMode
    ? `/ajout-structure/${params.dnaCode}/05-verification`
    : `/ajout-structure/${params.dnaCode}/02-adresses`;
  const filialesContainerRef = useRef(null);

  useEffect(() => {
    if (filialesContainerRef.current) {
      autoAnimate(filialesContainerRef.current);
    }
  }, [filialesContainerRef]);

  const defaultType = useMemo(() => {
    if (!params.dnaCode) {
      return undefined;
    }
    const dnaCode = params.dnaCode as string;

    if (dnaCode.startsWith("C")) {
      return StructureType.CADA;
    }
    if (dnaCode.startsWith("H")) {
      return StructureType.HUDA;
    }
    if (dnaCode.startsWith("K")) {
      return StructureType.CAES;
    }
    if (dnaCode.startsWith("R")) {
      return StructureType.CPH;
    }
    return undefined;
  }, [params.dnaCode]);

  const defaultValues = useMemo(() => {
    return {
      cpom: false,
      type: defaultType,
    };
  }, [defaultType]);

  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<IdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const mergedDefaultValues = useMemo(() => {
    return {
      ...defaultValues,
      ...localStorageValues,
    };
  }, [defaultValues, localStorageValues]);

  const [isManagedByAFiliale, setIsManagedByAFiliale] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [type, setType] = useState<string | undefined>(
    localStorageValues?.type ?? defaultType
  );

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      setIsManagedByAFiliale(!!localStorageValues.filiale);
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  // Synchronise type avec localStorage OU defaultType, à chaque changement de dnaCode
  useEffect(() => {
    // Quand le dnaCode ou le localStorage change, on recalcule type
    setType(localStorageValues?.type ?? defaultType);
  }, [localStorageValues?.type, defaultType]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // TODO : Refacto ce composant pour isoler la logique du localStorage et éviter les problèmes de réhydratation
  if (!isClient) {
    return null;
  }
  return (
    <FormWrapper
      schema={IdentificationSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-identification`}
      nextRoute={nextRoute}
      resetRoute={resetRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
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
                      target="_blank"
                      rel="noopener noreferrer"
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
                id="dnaCode"
                {...register("dnaCode")}
                defaultValue={params.dnaCode}
              />

              <div className="flex">
                <ToggleSwitch
                  label="Cette structure appartient-elle à une filiale d’opérateur (ex: YSOS, filiale de SOS) ?"
                  labelPosition="left"
                  showCheckedHint={false}
                  className="w-fit [&_label]:gap-2"
                  checked={isManagedByAFiliale}
                  name="managed-by-a-filiale"
                  id="managed-by-a-filiale"
                  onChange={() => setIsManagedByAFiliale(!isManagedByAFiliale)}
                />
                <p className="pl-2">{isManagedByAFiliale ? "Oui" : "Non"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectWithValidation
                  name="type"
                  control={control}
                  label="Type"
                  required
                  onChange={(event) => setType(event)}
                  id="type"
                >
                  <option value="">Sélectionnez un type</option>
                  {Object.values(StructureType)
                    .filter(
                      (structureType) => structureType !== StructureType.PRAHDA
                    )
                    .map((type) => (
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
                  id="operateur"
                />

                <div ref={filialesContainerRef}>
                  {isManagedByAFiliale && (
                    <InputWithValidation
                      name="filiale"
                      control={control}
                      type="text"
                      label="Filiale"
                      id="filiale"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputWithValidation
                  name="creationDate"
                  control={control}
                  type="date"
                  label="Date de création de la structure"
                  id="creationDate"
                />
                {isStructureSubventionnee(type) && (
                  <InputWithValidation
                    name="finessCode"
                    control={control}
                    type="text"
                    label="Code FINESS"
                    id="finessCode"
                  />
                )}
                <SelectWithValidation
                  name="public"
                  control={control}
                  label="Public"
                  id="public"
                >
                  <option value="">Sélectionnez une option</option>
                  {Object.values(PublicType).map((publicType) => (
                    <option key={publicType} value={publicType}>
                      {publicType}
                    </option>
                  ))}
                </SelectWithValidation>
              </div>
              <Notice
                severity="info"
                title=""
                className="rounded [&_p]:flex [&_p]:items-center"
                description="LGBT : Lesbiennes, Gays, Bisexuels et Transgenres – FVV : Femmes Victimes de Violences–TEH : Traîte des Êtres Humains"
              />
              <label className="flex gap-6">
                Actuellement, la structure dispose-t-elle de places labellisées
                / spécialisées ?
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
              <div className="flex">
                <ToggleSwitch
                  inputTitle="CPOM"
                  label="Actuellement, la structure fait-elle partie d’un CPOM ?"
                  labelPosition="left"
                  showCheckedHint={false}
                  className="w-fit"
                  checked={cpom ? true : false}
                  onChange={(event) => setValue("cpom", event)}
                />
                <p className="pl-2">{cpom ? "Oui" : "Non"}</p>
              </div>
            </fieldset>

            <hr />

            <h2 className="text-xl font-bold mb-0 text-title-blue-france">
              Contacts
            </h2>

            <Notice
              severity="info"
              title=""
              className="rounded [&_p]:flex [&_p]:items-center"
              description="Veuillez renseigner en contact principal la personne responsable de la structure et en contact secondaire la personne en charge du suivi opérationnel et/ou de la gestion budgétaire et financière."
            />

            <fieldset className="flex flex-col gap-6">
              <legend className="text-lg font-bold mb-4 text-title-blue-france">
                Contact principal
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputWithValidation
                  name="contactPrincipal.prenom"
                  id="contactPrincipal.prenom"
                  control={control}
                  type="text"
                  label="Prénom"
                />
                <InputWithValidation
                  name="contactPrincipal.nom"
                  id="contactPrincipal.nom"
                  control={control}
                  type="text"
                  label="Nom"
                />
                <InputWithValidation
                  name="contactPrincipal.role"
                  id="contactPrincipal.role"
                  control={control}
                  type="text"
                  label="Fonction"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithValidation
                  name="contactPrincipal.email"
                  id="contactPrincipal.email"
                  control={control}
                  type="email"
                  label="Email"
                />
                <InputWithValidation
                  name="contactPrincipal.telephone"
                  id="contactPrincipal.telephone"
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
                  id="contactSecondaire.prenom"
                  control={control}
                  type="text"
                  label="Prénom"
                />
                <InputWithValidation
                  name="contactSecondaire.nom"
                  id="contactSecondaire.nom"
                  control={control}
                  type="text"
                  label="Nom"
                />
                <InputWithValidation
                  name="contactSecondaire.role"
                  id="contactSecondaire.role"
                  control={control}
                  type="text"
                  label="Fonction"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithValidation
                  name="contactSecondaire.email"
                  id="contactSecondaire.email"
                  control={control}
                  type="email"
                  label="Email"
                />
                <InputWithValidation
                  name="contactSecondaire.telephone"
                  id="contactSecondaire.telephone"
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
              {isStructureSubventionnee(type) && (
                <fieldset className="flex flex-col gap-6">
                  <legend className="text-lg font-bold mb-2 text-title-blue-france">
                    Période d’autorisation en cours
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                    <InputWithValidation
                      name="debutPeriodeAutorisation"
                      id="debutPeriodeAutorisation"
                      control={control}
                      type="date"
                      label="Date de début"
                    />

                    <InputWithValidation
                      name="finPeriodeAutorisation"
                      id="finPeriodeAutorisation"
                      control={control}
                      type="date"
                      label="Date de fin"
                    />
                  </div>
                </fieldset>
              )}

              {cpom && (
                <fieldset className="flex flex-col gap-6">
                  <legend className="text-lg font-bold mb-2 text-title-blue-france">
                    CPOM en cours
                  </legend>

                  <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                    <InputWithValidation
                      name="debutCpom"
                      id="debutCpom"
                      control={control}
                      type="date"
                      label="Date de début"
                    />

                    <InputWithValidation
                      name="finCpom"
                      id="finCpom"
                      control={control}
                      type="date"
                      label="Date de fin"
                    />
                  </div>
                </fieldset>
              )}

              <fieldset className="flex flex-col gap-6">
                <legend className="text-lg font-bold mb-2 text-title-blue-france">
                  Convention en cours
                  {isStructureSubventionnee(type) ? " (optionnel)" : ""}
                </legend>
                {isStructureSubventionnee(type) && (
                  <Notice
                    severity="info"
                    title=""
                    className="rounded [&_p]:flex  [&_p]:items-center"
                    description="Uniquement si votre structure est sous convention."
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
                  <InputWithValidation
                    name="debutConvention"
                    id="debutConvention"
                    control={control}
                    type="date"
                    label="Date de début"
                  />

                  <InputWithValidation
                    name="finConvention"
                    id="finConvention"
                    control={control}
                    type="date"
                    label="Date de fin"
                  />
                </div>
              </fieldset>
            </div>
          </>
        );
      }}
    </FormWrapper>
  );
}
