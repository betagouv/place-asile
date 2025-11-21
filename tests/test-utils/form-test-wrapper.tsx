import { ReactNode } from "react";
import { FormProvider as HookFormProvider, useForm } from "react-hook-form";

import { FormProvider } from "@/app/context/FormContext";

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
