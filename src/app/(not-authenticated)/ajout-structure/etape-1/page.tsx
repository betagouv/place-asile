/* eslint-disable react/no-children-prop */
"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { step1Schema } from "../validation/validation";
import Input from "@codegouvfr/react-dsfr/Input";
import Button from "@codegouvfr/react-dsfr/Button";
import { useEffect, useMemo } from "react";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import { useRouter } from "next/navigation";

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
      router.push("/ajout-structure/etape-2");
    },

    defaultValues: {
      prenom: localStorageValues.prenom || "",
      nom: localStorageValues.nom || "",
      email: localStorageValues.email || "",
    },
    validators: {
      onChange: step1Schema,
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
          name="prenom"
          children={(field) => {
            console.log(field.state.meta.errors);
            return (
              <>
                <Input
                  nativeInputProps={{
                    name: "prenom",
                    type: "text",
                    required: true,
                    value: form.state.values.prenom,
                    onChange: (e) => {
                      if (typeof window !== "undefined") {
                        localStorageValues.prenom = e.target.value;
                        localStorage.setItem(
                          "ajout-structure",
                          JSON.stringify(localStorageValues)
                        );
                      }
                      field.handleChange(e.target.value);
                    },
                  }}
                  label="Prénom"
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
          name="nom"
          children={(field) => {
            return (
              <>
                <Input
                  nativeInputProps={{
                    name: "nom",
                    type: "text",
                    required: true,
                    value: form.state.values.nom,
                    onChange: (e) => {
                      if (typeof window !== "undefined") {
                        localStorageValues.nom = e.target.value;
                        localStorage.setItem(
                          "ajout-structure",
                          JSON.stringify(localStorageValues)
                        );
                      }
                      field.handleChange(e.target.value);
                    },
                  }}
                  label="Nom"
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
          name="email"
          children={(field) => {
            return (
              <>
                <Input
                  nativeInputProps={{
                    name: "email",
                    type: "email",
                    required: true,
                    value: form.state.values.email,
                    onChange: (e) => {
                      if (typeof window !== "undefined") {
                        localStorageValues.email = e.target.value;
                        localStorage.setItem(
                          "ajout-structure",
                          JSON.stringify(localStorageValues)
                        );
                      }
                      field.handleChange(e.target.value);
                    },
                  }}
                  label="Email"
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
