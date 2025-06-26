import React from "react";
import InputWithValidation from "../../../InputWithValidation";
import { useFormContext } from "react-hook-form";

export default function ContactFields() {
  // @TODO : Find a way to get back the contact schema type without loosing the flexibility
  const { control } = useFormContext();
  return (
    <>
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
    </>
  );
}
