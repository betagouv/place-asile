"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormAdresses from "../../forms/FormAdresses";

export default function StepInfo() {
  return (
    <>
      <Stepper
        currentStep={3}
        nextTitle="Types de places"
        stepCount={4}
        title="Adresses"
      />

      <FormAdresses />
    </>
  );
}
