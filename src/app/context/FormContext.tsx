"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

// Create a context for form methods with proper typing
const FormContext = createContext<UseFormReturn<
  Record<string, unknown>
> | null>(null);

// Provider component
export function FormProvider<
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({
  children,
  formMethods,
}: {
  children: ReactNode;
  formMethods: UseFormReturn<TFormValues>;
}) {
  return (
    <FormContext.Provider
      value={formMethods as UseFormReturn<Record<string, unknown>>}
    >
      {children}
    </FormContext.Provider>
  );
}

// Hook to use form methods
export function useFormContext<
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context as UseFormReturn<TFormValues>;
}
