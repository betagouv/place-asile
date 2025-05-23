"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import Upload from "./Upload";

export default function UploadWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({ name, control }: UploadWithValidationProps<TFieldValues>) {
  const finalControl = control;

  const { field } = useController({
    name,
    control: finalControl,
  });

  const fieldState = finalControl?.getFieldState(name);

  return (
    <Upload
      state={fieldState?.invalid ? "error" : field.value ? "success" : "idle"}
      errorMessage={fieldState?.error?.message}
      {...field}
    />
  );
}

type UploadWithValidationProps<TFieldValues extends FieldValues = FieldValues> =
  Partial<UseControllerProps<TFieldValues>> & {
    name: Path<TFieldValues>; // Use Path type for proper type checking
    control?: Control<TFieldValues>;
  };
