import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import React, { useEffect, useRef, useState } from "react";
import SelectWithValidation from "../../../SelectWithValidation";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import InputWithValidation from "../../../InputWithValidation";
import Notice from "@codegouvfr/react-dsfr/Notice";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import autoAnimate from "@formkit/auto-animate";
import { StructureType, PublicType } from "@/types/structure.type";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { DescriptionFormValues } from "./validation/descriptionSchema";
import { defaultType } from "./validation/descriptionSchema";

export default function DescriptionFields() {
  const [isManagedByAFiliale, setIsManagedByAFiliale] = useState(false);
  const params = useParams();

  const { register, control, watch, setValue } =
    useFormContext<DescriptionFormValues>();

  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<DescriptionFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const filialesContainerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [type, setType] = useState<StructureType | undefined>(
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
  }, [localStorageValues?.type]);
  useEffect(() => {
    if (filialesContainerRef.current) {
      autoAnimate(filialesContainerRef.current);
    }
  }, [filialesContainerRef]);

  return (
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
          //   onChange={(event) => setType(event)}
          id="type"
        >
          <option value="">Sélectionnez un type</option>
          {Object.values(StructureType)
            .filter((structureType) => structureType !== StructureType.PRAHDA)
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
        {isStructureAutorisee(type) && (
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
        Actuellement, la structure dispose-t-elle de places labellisées /
        spécialisées ?
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
          checked={watch("cpom") ? true : false}
          onChange={(event) => setValue("cpom", event)}
        />
        <p className="pl-2">{watch("cpom") ? "Oui" : "Non"}</p>
      </div>
    </fieldset>
  );
}
