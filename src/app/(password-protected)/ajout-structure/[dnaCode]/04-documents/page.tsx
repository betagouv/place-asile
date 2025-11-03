"use client";
import Stepper from "@codegouvfr/react-dsfr/Stepper";

import FormDocuments from "../../_components/forms/FormDocuments";

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
