"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormTypePlaces from "../../forms/FormTypePlaces";

export default function StepInfo() {
  return (
    <>
      <Stepper
        currentStep={3}
        nextTitle="Documents financiers"
        stepCount={4}
        title="Types de places"
      />

      <FormTypePlaces />
    </>
  );
}
