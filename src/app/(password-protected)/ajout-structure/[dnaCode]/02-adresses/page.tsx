"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";

import FormAdresses from "../../_components/forms/FormAdresses";

export default function StepAdresses() {
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
