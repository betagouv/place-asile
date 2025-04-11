/* eslint-disable react/no-children-prop */
"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { step2Schema } from "../validation/validation";
import Input from "@codegouvfr/react-dsfr/Input";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect, useMemo } from "react";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      onChange: step2Schema,
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
        <form.Field
          name="company"
          children={(field) => {
            console.log(field.state.meta.errors);
            return (
              <>
                <Input
                  nativeInputProps={{
                    name: "company",
                    type: "text",
                    required: true,
                    value: form.state.values.company,
                    onChange: (e) => {
                      if (typeof window !== "undefined") {
                        localStorageValues.company = e.target.value;
                        localStorage.setItem(
                          "ajout-structure",
                          JSON.stringify(localStorageValues)
                        );
                      }
                      field.handleChange(e.target.value);
                    },
                  }}
                  label="Nom de l'entreprise"
                  state={
                    field.state.meta.errors?.length > 0 ? "error" : "default"
                  }
                  stateRelatedMessage={field.state.meta.errors
                    ?.map((error) => error && error.message)
                    .join("\n")}
                />
              </>
            );
          }}
        />
        <form.Field
          name="years"
          children={(field) => {
            return (
              <>
                <Input
                  nativeInputProps={{
                    name: "years",
                    type: "text",
                    required: true,
                    value: form.state.values.years,
                    onChange: (e) => {
                      if (typeof window !== "undefined") {
                        localStorageValues.years = e.target.value;
                        localStorage.setItem(
                          "ajout-structure",
                          JSON.stringify(localStorageValues)
                        );
                      }
                      field.handleChange(e.target.value);
                    },
                  }}
                  label="Années d'expérience"
                  state={
                    field.state.meta.errors?.length > 0 ? "error" : "default"
                  }
                  stateRelatedMessage={field.state.meta.errors
                    ?.map((error) => error && error.message)
                    .join("\n")}
                />
              </>
            );
          }}
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
