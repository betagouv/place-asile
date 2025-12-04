"use client";

import Stepper from "@codegouvfr/react-dsfr/Stepper";

import FormIdentification from "@/app/(password-protected)/ajout-structure/_components/forms/FormIdentification";
import { useRedirectIfStructureExists } from "@/app/hooks/useRedirectIfStructureExists";

export default function StepInfo() {
  useRedirectIfStructureExists();

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
