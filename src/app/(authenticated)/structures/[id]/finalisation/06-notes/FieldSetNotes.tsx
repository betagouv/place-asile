import { useRef } from "react";
import { useController, useForm, useFormContext } from "react-hook-form";

export const FieldSetNotes = () => {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const parentFormContext = useFormContext();
  const localForm = useForm();
  const { register, control } = parentFormContext || localForm;

  const { fieldState } = useController({
    name: "notes",
    control,
  });

  return (
    <fieldset className="flex flex-col" ref={fieldsetRef}>
      <textarea
        id="notes"
        rows={8}
        className="fr-input"
        {...register("notes")}
      />
      {fieldState.error?.message && (
        <p className="text-default-error m-0 p-0">Ce champ est obligatoire</p>
      )}
    </fieldset>
  );
};
