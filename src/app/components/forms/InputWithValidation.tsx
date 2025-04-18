import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";

export default function InputWithValidation({
  name,
  control,
  type,
  label,
  required,
}: InputWithValidationProps) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  return (
    <Input
      nativeInputProps={{
        type,
        ...field,
      }}
      label={label}
      state={fieldState.invalid ? "error" : "default"}
      stateRelatedMessage={fieldState.error?.message}
    />
  );
}

type InputWithValidationProps = UseControllerProps & {
  name: string;
  type: string;
  label: string;
  control: UseControllerProps["control"];
  required?: boolean;
};
