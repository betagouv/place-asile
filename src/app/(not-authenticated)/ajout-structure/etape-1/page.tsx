"use client";

import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormInformations from "../forms/FormInformations";

export default function StepInfo() {
  return (
    <div className="fr-container mx-auto my-10">
      <Stepper
        currentStep={1}
        nextTitle="Étape 2"
        stepCount={3}
        title="Étape 1"
      />

      <FormInformations />
    </div>
  );
}
