"use client";

import * as React from "react";
import {
  useController,
  UseControllerProps,
  Control,
  FieldValues,
} from "react-hook-form";
import Input from "@codegouvfr/react-dsfr/Input";

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
}: InputWithValidationProps<TFieldValues>) {
  // Use the form context if control is not provided
  const finalControl = control;

  const { field, fieldState } = useController({
    name,
    control: finalControl,
    rules: {
      required,
    },
  });

  // For date inputs, we need to handle the format conversion
  // HTML date inputs require YYYY-MM-DD format internally
  // But we want to display and store dates as DD/MM/YYYY
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "date") {
      const htmlDateValue = e.target.value; // YYYY-MM-DD
      if (htmlDateValue) {
        // Convert YYYY-MM-DD to DD/MM/YYYY
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
    } else {
      field.onChange(e.target.value);
    }
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for HTML date input
  const getHtmlDateValue = () => {
    if (type === "date" && field.value && typeof field.value === "string") {
      // Check if it's already in DD/MM/YYYY format
      const dateParts = field.value.split("/");
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        // Ensure we have valid values before creating the date string
        if (day && month && year) {
          // Pad with leading zeros if needed
          const paddedDay = day.padStart(2, '0');
          const paddedMonth = month.padStart(2, '0');
          return `${year}-${paddedMonth}-${paddedDay}`;
        }
      }
    }
    return field.value || "";
  };

  return (
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
  };
