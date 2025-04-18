"use client";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { InformationsSchema } from "../validation/validation";
import { z } from "zod";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { PublicType, StructureType } from "@/types/structure.type";
import Button from "@codegouvfr/react-dsfr/Button";
import { AnimatePresence, motion } from "motion/react";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";

export default function FormInformations() {
  const [
    localStorageValues,
    updateLocalStorageValues,
    resetLocalStorageValues,
  ] = useLocalStorage("ajout-structure", {});

  const { handleSubmit, control, register } = useForm({
    resolver: zodResolver(InformationsSchema),
    mode: "onBlur",

    defaultValues: {
      ...localStorageValues,
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof InformationsSchema>> = (data) =>
    console.log(data);

  const formValues = useWatch({ control });

  const [isManagedByAFilial, setIsManagedByAFilial] = useState(false);
  const [hasCPOM, setHasCPOM] = useState(false);

  useEffect(() => {
    updateLocalStorageValues(formValues);
  }, [formValues, updateLocalStorageValues]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg border-default-grey border flex flex-col gap-8"
    >
      <fieldset className="flex flex-col gap-6">
        <legend className="text-xl font-bold mb-4 text-title-blue-france">
          Description
        </legend>

        <Checkbox
          options={[
            {
              label: "Cette structure est gérée par une filiale.",
              nativeInputProps: {
                name: "managed-by-a-filial",
                value: isManagedByAFilial ? "true" : "false",
                onChange: (e) => setIsManagedByAFilial(e.target.checked),
              },
            },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectWithValidation
            name="type"
            control={control}
            label="Type"
            disabled
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

          <AnimatePresence>
            {isManagedByAFilial && (
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <InputWithValidation
                  name="filiale"
                  control={control}
                  type="text"
                  label="Filiale"
                />
              </motion.div>
            )}
          </AnimatePresence>
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
            label="Code FINESSE"
          />
          <SelectWithValidation name="public" control={control} label="Public">
            <option value="">Sélectionnez un public</option>
            {Object.values(PublicType).map((publicType) => (
              <option key={publicType} value={publicType}>
                {publicType}
              </option>
            ))}
          </SelectWithValidation>
        </div>

        <ToggleSwitch
          inputTitle="the-title"
          label="Actuellement, la structure fait-elle partie d’un CPOM ?"
          labelPosition="left"
          showCheckedHint={false}
          className="w-fit"
          checked={hasCPOM ? true : false}
          onChange={(value) => {
            setHasCPOM(value);
          }}
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
      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={() => {
            resetLocalStorageValues("ajout-structure");
          }}
          priority="secondary"
        >
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
