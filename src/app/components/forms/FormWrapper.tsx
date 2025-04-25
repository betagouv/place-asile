"use client";

import {
  useForm,
  SubmitHandler,
  useWatch,
  FieldErrors,
  UseFormReturn,
  FormProvider as HookFormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@/app/utils/classname.util";
import { FormProvider } from "@/app/context/FormContext";

// Define more specific types for the schema
type FormWrapperProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  localStorageKey?: string;
  children: ReactNode | ((form: UseFormReturn<z.infer<TSchema>>) => ReactNode);
  onSubmit?: SubmitHandler<z.infer<TSchema>>;
  onError?: (errors: FieldErrors<z.infer<TSchema>>) => void;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  className?: string;
  defaultValues?: Partial<z.infer<TSchema>>;
  onFormChange?: (values: z.infer<TSchema>) => void;
  submitButtonText?: string;
  nextRoute?: string;
  showSubmitButton?: boolean;
};

export default function FormWrapper<TSchema extends z.ZodTypeAny>({
  schema,
  localStorageKey = "",
  children,
  onSubmit,
  onError,
  mode = "onBlur",
  className,
  defaultValues = {},
  onFormChange,
  submitButtonText = "Continuer",
  nextRoute,
  showSubmitButton = true,
}: FormWrapperProps<TSchema>) {
  const router = useRouter();
  const [localStorageValues, updateLocalStorageValues] = useLocalStorage(
    localStorageKey,
    {}
  );

  const mergedDefaultValues = {
    ...localStorageValues,
    ...defaultValues,
  } as z.infer<TSchema>;

  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode,
    defaultValues: mergedDefaultValues as z.infer<TSchema>,
    criteriaMode: "all",
  });

  const { handleSubmit, control, formState } = methods;

  const handleFormErrors = (errors: FieldErrors<z.infer<TSchema>>) => {
    console.error("Form validation errors:", errors);
    if (onError) {
      onError(errors);
    }
  };

  const defaultSubmitHandler: SubmitHandler<z.infer<TSchema>> = (data) => {
    console.log("Form submitted successfully with data:", data);
    if (nextRoute) {
      try {
        router.push(nextRoute);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues) {
      updateLocalStorageValues(formValues);
      if (onFormChange) {
        onFormChange(formValues);
      }
    }
  }, [formValues, updateLocalStorageValues, onFormChange]);

  return (
    <HookFormProvider {...methods}>
      <FormProvider formMethods={methods}>
        <form
          onSubmit={handleSubmit(
            onSubmit || defaultSubmitHandler,
            handleFormErrors
          )}
          className={cn(
            "bg-white p-6 rounded-lg border-default-grey border flex flex-col gap-8",
            className
          )}
        >
          {typeof children === "function" ? children(methods) : children}

          {showSubmitButton && (
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  methods.reset();
                }}
                priority="secondary"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={!formState.isValid}>
                {submitButtonText}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </HookFormProvider>
  );
}
