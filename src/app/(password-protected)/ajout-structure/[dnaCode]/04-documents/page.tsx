"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormDocuments from "../../../../components/forms/structures/FormDocuments";

export default function StepDocuments() {
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
