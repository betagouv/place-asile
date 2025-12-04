"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";

import { useRedirectIfStructureExists } from "@/app/hooks/useRedirectIfStructureExists";

import FormTypePlaces from "../../_components/forms/FormTypePlaces";

export default function StepTypePlaces() {
  useRedirectIfStructureExists();

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
