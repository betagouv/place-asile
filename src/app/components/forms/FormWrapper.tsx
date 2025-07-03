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
import { useEffect, ReactNode, useState } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import Button from "@codegouvfr/react-dsfr/Button";
import { cn } from "@/app/utils/classname.util";
import { FormProvider } from "@/app/context/FormContext";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import Link from "next/link";

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
  resetRoute?: string;
  showSubmitButton?: boolean;
  previousStep?: string;
  availableFooterButtons?: Array<"cancel" | "save" | "submit">;
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
  resetRoute,
  showSubmitButton = true,
  previousStep,
  availableFooterButtons = ["cancel", "save", "submit"],
}: FormWrapperProps<TSchema>) {
  const router = useRouter();
  const {
    currentValue: localStorageValues,
    updateLocalStorageValue: updateLocalStorageValues,
    resetLocalStorageValues,
  } = useLocalStorage(localStorageKey, {});

  const mergedDefaultValues = {
    ...localStorageValues,
    ...defaultValues,
  } as z.infer<TSchema>;

  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),

    mode,
    defaultValues: mergedDefaultValues as z.infer<TSchema>,
    criteriaMode: "all",
    shouldFocusError: true,
  });

  const { handleSubmit, control, reset } = methods;

  const handleReset = () => {
    if (
      window.confirm(
        "Attention : Toutes les données saisies sur cette étape vont être effacées. Êtes-vous sûr·e de vouloir continuer ?"
      )
    ) {
      resetLocalStorageValues();
      reset(defaultValues as z.infer<TSchema>);
      if (resetRoute) {
        router.push(resetRoute);
        window.location.reload();
      }
    }
  };

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

  // State for alert
  const [showAlert, setShowAlert] = useState(false);

  const showSavedAlert = () => setShowAlert(true);
  const hideAlert = () => setShowAlert(false);

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
          {previousStep && (
            <Link
              href={previousStep}
              className="flex gap-2 fr-link fr-icon  w-fit text-disabled-grey"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Étape précédente
            </Link>
          )}
          {typeof children === "function" ? children(methods) : children}

          {showSubmitButton && (
            <>
              {showAlert && (
                <Alert
                  className="mb-4"
                  severity="success"
                  title="Enregistré pour plus tard"
                  description="Votre progression a été enregistrée. Les données sont sauvegardées localement dans votre navigateur."
                  closable
                  onClose={hideAlert}
                />
              )}
              <div>
                <div className="flex justify-end gap-4 mt-6">
                  {availableFooterButtons.includes("cancel") && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleReset();
                      }}
                      priority="secondary"
                    >
                      Annuler
                    </Button>
                  )}
                  {availableFooterButtons.includes("save") && (
                    <Button
                      priority="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        showSavedAlert();
                      }}
                    >
                      Terminer plus tard
                    </Button>
                  )}
                  {availableFooterButtons.includes("submit") && (
                    <Button type="submit">{submitButtonText}</Button>
                  )}
                </div>
                <p className="cta_message text-mention-grey text-sm text-right mt-2">
                  Si vous ne parvenez pas à remplir certains champs,{" "}
                  <a
                    href={`mailto:${PLACE_ASILE_CONTACT_EMAIL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    contactez-nous par mail
                  </a>{" "}
                  ou au 06 69 37 24 15.
                </p>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </HookFormProvider>
  );
}
