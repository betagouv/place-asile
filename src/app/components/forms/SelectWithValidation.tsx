import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Select from "@codegouvfr/react-dsfr/Select";

export default function SelectWithValidation({
  name,
  control,
  label,
  required,
  children,
  disabled,
}: SelectWithValidationProps) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      required,
    },
  });

  return (
    <Select
      label={label}
      nativeSelectProps={{
        ...field,
      }}
      disabled={disabled}
      state={fieldState.invalid ? "error" : "default"}
      stateRelatedMessage={fieldState.error?.message}
    >
      {children}
    </Select>
  );
}

type SelectWithValidationProps = UseControllerProps & {
  name: string;
  label: string;
  control: UseControllerProps["control"];
  required?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
};
