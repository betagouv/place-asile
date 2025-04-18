/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Select from "@codegouvfr/react-dsfr/Select";

export default function SelectWithValidation({
  name,
  control,
  label,
  required,
  children,
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
      state={fieldState.invalid ? "error" : "default"}
      stateRelatedMessage={fieldState.error?.message}
    >
      {children}
    </Select>
  );
}

type SelectWithValidationProps = UseControllerProps<any> & {
  name: string;
  label: string;
  control: any;
  required?: boolean;
  children: React.ReactNode;
};
