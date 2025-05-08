"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
} from "react-hook-form";
import Upload from "./Upload";

export default function UploadWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({ name, control, required }: UploadWithValidationProps<TFieldValues>) {
  const finalControl = control;

  const { field } = useController({
    name,
    control: finalControl,
    rules: {
      required,
    },
  });

  return <Upload {...field} />;
}

type UploadWithValidationProps<TFieldValues extends FieldValues = FieldValues> =
  Partial<UseControllerProps<TFieldValues>> & {
    name: string;
    control?: Control<TFieldValues>;
    required?: boolean;
  };
