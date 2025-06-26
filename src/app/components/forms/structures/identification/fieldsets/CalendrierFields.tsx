import { isStructureAutorisee } from "@/app/utils/structure.util";
import Notice from "@codegouvfr/react-dsfr/Notice";
import React from "react";
import InputWithValidation from "../../../InputWithValidation";
import { useFormContext } from "react-hook-form";
import { IdentificationFormValues } from "../../../../../(password-protected)/ajout-structure/[dnaCode]/01-identification/validation/identificationSchema";

export default function CalendrierFields() {
  // @TODO : Find a way to get back the contact schema type without loosing the flexibility
  const { control, watch } = useFormContext<IdentificationFormValues>();
  const type = watch("type");
  const cpom = watch("cpom");

  return (
    <>
      {isStructureAutorisee(type) && (
        <fieldset className="flex flex-col gap-6">
          <legend className="text-lg font-bold mb-2 text-title-blue-france">
            Période d&apos;autorisation en cours
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
          {isStructureAutorisee(type) ? " (optionnel)" : ""}
        </legend>
        {isStructureAutorisee(type) && (
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
    </>
  );
}
