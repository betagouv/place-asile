import { useRef } from "react";
import { useForm, useFormContext } from "react-hook-form";

export const FieldSetNotes = () => {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const parentFormContext = useFormContext();
  const localForm = useForm();
  const { register } = parentFormContext || localForm;

  return (
    <fieldset className="flex flex-col" ref={fieldsetRef}>
      <textarea
        id="notes"
        rows={4}
        className="fr-input"
        {...register("notes")}
      />
    </fieldset>
  );
};
