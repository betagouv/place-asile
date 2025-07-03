import React from "react";
import InputWithValidation from "../../InputWithValidation";
import { useFormContext } from "react-hook-form";

export const FieldSetOuvertureFermeture = () => {
  const { control } = useFormContext();
  const currentYear = new Date().getFullYear();

  return (
    <fieldset className="flex flex-col">
      <legend className="text-lg font-bold mb-8 text-title-blue-france">
        Ouverture et fermeture en {currentYear}
      </legend>
      <p className="mb-2">
        En {currentYear}, sur le nombre total de places autorisées, combien
        restent à créer ? (Indiquez “0” si non prévu)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6 mb-4">
        <InputWithValidation
          name="placesACreer"
          id="placesACreer"
          control={control}
          type="number"
          label="Nombre de places à créer"
        />
        <InputWithValidation
          name="echeancePlacesACreer"
          id="echeancePlacesACreer"
          control={control}
          type="date"
          label="Echéance"
        />
      </div>
      <p className="mb-2">
        En {currentYear}, sur le nombre total de places autorisées, combien
        restent à fermer ? (Indiquez “0” si non prévu)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 w-1/2 gap-6">
        <InputWithValidation
          name="placesAFermer"
          id="placesAFermer"
          control={control}
          type="number"
          label="Nombre de places à fermer"
        />
        <InputWithValidation
          name="echeancePlacesAFermer"
          id="echeancePlacesAFermer"
          control={control}
          type="date"
          label="Echéance"
        />
      </div>
    </fieldset>
  );
};
