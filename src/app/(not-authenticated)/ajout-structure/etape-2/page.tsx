/* eslint-disable react/no-children-prop */
"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { step2Schema } from "../validation/validation";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect, useMemo } from "react";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputWithValidation from "@/app/components/forms/InputWithValidation";

export default function Step1Form() {
  const router = useRouter();
  // The current localStorage values
  const localStorageValues = useMemo(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage?.getItem("ajout-structure") || "{}");
    }
    return {};
  }, []);

  const form = useForm({
    onSubmit: async ({ value }) => {
      console.log(value);
      router.push("/ajout-structure/etape-3");
    },

    defaultValues: {
      company: localStorageValues.company || "",
      years: localStorageValues.years || 0,
    },
    validators: {
      onSubmit: (values) => {
        const result = step2Schema.safeParse(values);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return;
      },
    },
  });

  const formState = useStore(form.store, (state) => state.values);

  useEffect(() => {
    console.log(formState);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "ajout-structure",
        JSON.stringify({ ...formState, ...localStorageValues })
      );
    }
  }, [formState, localStorageValues]);
  return (
    <div className="fr-container mx-auto my-10">
      <Link href="/ajout-structure/etape-1">
        &lt; <span className="underline">Étape précédente</span>
      </Link>
      <Stepper
        currentStep={1}
        nextTitle="Étape 2"
        stepCount={3}
        title="Étape 1"
      />{" "}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <InputWithValidation
          name="company"
          type="text"
          label="Nom de l'entreprise"
          form={form}
          schema={step2Schema}
          localstorageKey="ajout-structure"
        />

        <InputWithValidation
          name="years"
          type="text"
          label="Années d'expérience"
          form={form}
          schema={step2Schema}
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
