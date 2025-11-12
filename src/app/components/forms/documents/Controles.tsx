import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { ControleFormValues } from "@/schemas/forms/base/controle.schema";

import { Controle } from "./Controle";

export const Controles = (): ReactElement => {
  const { control, watch } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: "controles",
  });

  const controles = watch("controles") || [];

  const createNewControle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newField = {
      date: "",
      type: undefined,
      uuid: uuidv4(),
    };

    append(newField);
  };

  const deleteControle = (index: number) => {
    remove(index);
  };

  return (
    <fieldset className="flex flex-col gap-6 w-full">
      <legend className="text-xl font-bold mb-4 text-title-blue-france">
        Inspections-contrôles (optionnel)
      </legend>
      {controles.map((field: ControleFormValues, index: number) => {
        return (
          <Controle
            key={field.id || field.uuid}
            field={field}
            index={index}
            handleDeleteField={() => deleteControle(index)}
          />
        );
      })}
      <Button
        onClick={createNewControle}
        priority="tertiary no outline"
        className="underline font-normal p-0"
      >
        + Ajouter une inspection-contrôle
      </Button>
    </fieldset>
  );
};
