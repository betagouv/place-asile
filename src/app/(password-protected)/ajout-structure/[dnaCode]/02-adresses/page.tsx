"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";

import { useRedirectIfStructureExists } from "@/app/hooks/useRedirectIfStructureExists";

import FormAdresses from "../../_components/forms/FormAdresses";

export default function StepAdresses() {
  useRedirectIfStructureExists();

  return (
    <>
      <Stepper
        currentStep={2}
        nextTitle="Types de places"
        stepCount={4}
        title="Adresses"
      />

      <FormAdresses />
    </>
  );
}
