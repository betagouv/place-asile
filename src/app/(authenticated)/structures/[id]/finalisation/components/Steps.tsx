import Stepper from "@codegouvfr/react-dsfr/Stepper";
import React from "react";
const steps = [
  "Identification de la structure",
  "Adresses",
  "Types de places",
  "Finances",
  "Contrôle qualité & actes administratifs",
  "Notes",
];

export default function Steps({ currentStep }: StepsProps) {
  const title = steps[currentStep - 1];
  const nextTitle = currentStep < steps.length ? steps[currentStep] : "";
  return (
    <Stepper
      currentStep={currentStep}
      nextTitle={nextTitle}
      stepCount={steps.length}
      title={title}
      className="mx-8"
    />
  );
}

type StepsProps = {
  currentStep: number;
};
