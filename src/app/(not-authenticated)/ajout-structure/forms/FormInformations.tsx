"use client";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { InformationsSchema } from "../validation/validation";
import { z } from "zod";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { StructureType } from "@/types/structure.type";

export default function FormInformations() {
  const [
    localStorageValues,
    updateLocalStorageValues,
    resetLocalStorageValues,
  ] = useLocalStorage("ajout-structure", {});

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(InformationsSchema),
    mode: "onChange",

    defaultValues: {
      ...localStorageValues,
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof InformationsSchema>> = (data) =>
    console.log(data);

  const formValues = useWatch({ control });

  useEffect(() => {
    updateLocalStorageValues(formValues);
  }, [formValues, updateLocalStorageValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputWithValidation
        name="dnaCode"
        control={control}
        type="text"
        label="Code DNA"
      />

      <InputWithValidation
        name="operateur"
        control={control}
        type="text"
        label="Opérateur"
      />

      <SelectWithValidation name="type" control={control} label="Type" required>
        <option value="">Sélectionnez un type</option>
        {Object.values(StructureType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </SelectWithValidation>

      <button
        type="button"
        onClick={() => {
          resetLocalStorageValues("ajout-structure");
        }}
      >
        Reset
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
