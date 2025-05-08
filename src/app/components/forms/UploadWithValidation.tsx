"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
} from "react-hook-form";
import Upload from "./Upload";

export default function SelectWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({ name, control, required }: SelectWithValidationProps<TFieldValues>) {
  const finalControl = control;

  const { field } = useController({
    name,
    control: finalControl,
    rules: {
      required,
    },
  });

  return (
    // <Select
    //   label={label}
    //   nativeSelectProps={{
    //     ...field,
    //     onChange: (e) => {
    //       field.onChange(e);
    //       onChange?.(e.target.value);
    //     },
    //   }}
    //   disabled={disabled}
    //   state={fieldState.invalid ? "error" : "default"}
    //   stateRelatedMessage={fieldState.error?.message}
    // >
    //   {children}
    // </Select>

    <Upload {...field} />
  );
}

type SelectWithValidationProps<TFieldValues extends FieldValues = FieldValues> =
  Partial<UseControllerProps<TFieldValues>> & {
    name: string;
    label: string;
    control?: Control<TFieldValues>;
    required?: boolean;
  };
