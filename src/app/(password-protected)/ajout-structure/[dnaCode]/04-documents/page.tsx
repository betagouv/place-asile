"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormDocuments from "../../forms/FormDocuments";

export default function StepInfo() {
  return (
    <>
      <Stepper
        currentStep={4}
        nextTitle="Dernière étape"
        stepCount={4}
        title="Documents financiers"
      />

      <FormDocuments />
    </>
  );
}
