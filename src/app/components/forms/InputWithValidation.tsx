"use client";

import Input from "@codegouvfr/react-dsfr/Input";
import * as React from "react";
import {
  Control,
  FieldValues,
  Path,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { cn } from "@/app/utils/classname.util";

import InputSimple from "../ui/InputSimple";

export default function InputWithValidation<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  id,
  control,
  type,
  min,
  label,
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
  });

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
      // If the value is already in YYYY-MM-DD format (HTML date input format)
      if (/^\d{4}-\d{2}-\d{2}$/.test(field.value)) {
        return field.value;
      }

      // Handle DD/MM/YYYY format (our form validation format)
      const dateParts = field.value.split("/");
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        if (day && month && year) {
          const paddedDay = day.padStart(2, "0");
          const paddedMonth = month.padStart(2, "0");
          return `${year}-${paddedMonth}-${paddedDay}`;
        }
      }

      // Handle ISO date strings (e.g., "2006-04-26T22:00:00.000Z")
      const isoDate = new Date(field.value);
      if (!isNaN(isoDate.getTime())) {
        const year = isoDate.getFullYear();
        const month = String(isoDate.getMonth() + 1).padStart(2, "0");
        const day = String(isoDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    return field.value !== undefined && field.value !== null ? field.value : "";
  };

  // TODO : refacto pour gérer ce cas plus proprement
  if (type === "hidden") {
    return <></>;
  }

  return variant === "simple" ? (
    <InputSimple
      nativeInputProps={{
        id,
        type,
        onChange: type === "date" ? handleDateChange : field.onChange,
        value:
          type === "date"
            ? getHtmlDateValue()
            : field.value !== undefined && field.value !== null
              ? field.value
              : "",
        min,
        onBlur: field.onBlur,
        disabled: disabled,
        step: "any",
      }}
      {...field}
      label={label}
      className={cn(
        "transition-all",
        className,
        disabled && "!cursor-not-allowed bg-disabled-grey border-transparent"
      )}
      state={state || (fieldState.invalid ? "error" : "default")}
      stateRelatedMessage={stateRelatedMessage || fieldState.error?.message}
    />
  ) : (
    <Input
      nativeInputProps={{
        ...field,
        type,
        onChange: type === "date" ? handleDateChange : field.onChange,
        value: type === "date" ? getHtmlDateValue() : (field.value ?? ""),
        onBlur: field.onBlur,
        min,
        id,
      }}
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
    name: Path<TFieldValues>;
    id?: string;
    type: string;
    min?: number;
    label: string;
    control?: Control<TFieldValues>;
    hintText?: string;
    disabled?: boolean;
    addon?: React.ReactNode;
    className?: string;
    state?: "default" | "error" | "success";
    stateRelatedMessage?: string;
    variant?: "simple";
  };
