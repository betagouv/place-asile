"use client";

import Stepper from "@codegouvfr/react-dsfr/Stepper";

import FormIdentification from "@/app/(password-protected)/ajout-structure/forms/FormIdentification";

export default function StepInfo() {
  return (
    <>
      <Stepper
        currentStep={1}
        nextTitle="Adresses"
        stepCount={4}
        title="Identification de la structure"
      />
      <FormIdentification />
    </>
  );
}
