/* eslint-disable react/no-children-prop */
"use client";

import { useForm, useStore } from "@tanstack/react-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect } from "react";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { step1Schema } from "../validation/validation";
import InputWithValidation from "@/app/components/forms/InputWithValidation";

export default function Step1Form() {
  const router = useRouter();
  const [localStorageValues, updateLocalStorageValues] = useLocalStorage(
    "ajout-structure",
    {}
  );

  const form = useForm({
    onSubmit: async ({}) => {
      router.push("/ajout-structure/etape-2");
    },

    defaultValues: {
      prenom: localStorageValues?.prenom || "",
      nom: localStorageValues?.nom || "",
      email: localStorageValues?.email || "",
    },
    validators: {
      onSubmit: (values) => {
        const result = step1Schema.safeParse(values);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return;
      },
    },
  });

  const formState = useStore(form.store, (state) => state.values);

  useEffect(() => {
    updateLocalStorageValues(formState);
  }, [formState, updateLocalStorageValues]);
  return (
    <div className="fr-container mx-auto my-10">
      <Stepper
        currentStep={1}
        nextTitle="Étape 2"
        stepCount={3}
        title="Étape 1"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <InputWithValidation
          name="prenom"
          type="text"
          label="Prénom"
          form={form}
          schema={step1Schema}
          localstorageKey="ajout-structure"
        />

        <InputWithValidation
          name="nom"
          type="text"
          label="Nom"
          form={form}
          schema={step1Schema}
          localstorageKey="ajout-structure"
        />

        <InputWithValidation
          name="email"
          type="email"
          label="Email"
          form={form}
          schema={step1Schema}
          localstorageKey="ajout-structure"
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                Valider
              </Button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
