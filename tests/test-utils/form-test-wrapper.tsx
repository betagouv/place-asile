import { ReactNode } from "react";
import { FormProvider as HookFormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { FormProvider } from "@/app/context/FormContext";

// A permissive schema that accepts any object structure for testing
const testSchema = z.object({}).passthrough();

type FormTestWrapperProps = {
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
};

export function FormTestWrapper({
  children,
  defaultValues = {},
}: FormTestWrapperProps) {
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
  });

  return (
    <HookFormProvider {...methods}>
      <FormProvider formMethods={methods}>{children}</FormProvider>
    </HookFormProvider>
  );
}

export function resetAllMocks() {
  // Reset all vi mocks if needed
  // This is a placeholder - actual mock resets should be handled in individual test files
}
