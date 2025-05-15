"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
} from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";
import InputSimple from "../ui/InputSimple";

export default function InputWithValidation<
  TFieldValues extends FieldValues = FieldValues
>({
  name,
  control,
  type,
  label,
  required,
  hintText,
  disabled,
  addon,
  className,
  state,
  stateRelatedMessage,
  variant,
}: InputWithValidationProps<TFieldValues>) {
  const finalControl = control;

  const { field, fieldState } = useController({
    name,
    control: finalControl,
    rules: {
      required,
    },
  });

  // TODO @ledjay: check if dayjs can handle this
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "date") {
      const htmlDateValue = e.target.value;
      if (htmlDateValue) {
        const [year, month, day] = htmlDateValue.split("-");
        if (year && month && day) {
          const formattedDate = `${day}/${month}/${year}`;
          field.onChange(formattedDate);
        } else {
          field.onChange("");
        }
      } else {
        field.onChange("");
      }
    } else if (type === "number") {
      const value = e.target.value;
      field.onChange(value === "" ? "" : Number(value));
    } else {
      field.onChange(e.target.value);
    }
  };

  const getHtmlDateValue = () => {
    if (type === "date" && field.value && typeof field.value === "string") {
      const dateParts = field.value.split("/");
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        if (day && month && year) {
          const paddedDay = day.padStart(2, "0");
          const paddedMonth = month.padStart(2, "0");
          return `${year}-${paddedMonth}-${paddedDay}`;
        }
      }
    }
    return field.value || "";
  };

  return variant === "simple" ? (
    <InputSimple
      nativeInputProps={{
        type,
        onChange: type === "date" ? handleDateChange : field.onChange,
        value: type === "date" ? getHtmlDateValue() : field.value || "",
        onBlur: field.onBlur,
      }}
      {...field}
      label={label}
      className={className}
      state={state || (fieldState.invalid ? "error" : "default")}
      stateRelatedMessage={stateRelatedMessage || fieldState.error?.message}
    />
  ) : (
    <Input
      nativeInputProps={{
        type,
        onChange: type === "date" ? handleDateChange : field.onChange,
        value: type === "date" ? getHtmlDateValue() : field.value || "",
        onBlur: field.onBlur,
      }}
      {...field}
      label={label}
      hintText={hintText}
      disabled={disabled}
      addon={addon}
      className={className}
      state={state || (fieldState.invalid ? "error" : "default")}
      stateRelatedMessage={stateRelatedMessage || fieldState.error?.message}
    />
  );
}

type InputWithValidationProps<TFieldValues extends FieldValues = FieldValues> =
  Partial<UseControllerProps<TFieldValues>> & {
    name: string;
    type: string;
    label: string;
    control?: Control<TFieldValues>;
    required?: boolean;
    hintText?: string;
    disabled?: boolean;
    addon?: React.ReactNode;
    className?: string;
    state?: "default" | "error" | "success";
    stateRelatedMessage?: string;
    variant?: "simple";
  };
