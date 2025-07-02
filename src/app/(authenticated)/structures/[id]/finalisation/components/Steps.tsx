import Stepper from "@codegouvfr/react-dsfr/Stepper";
import React from "react";

export type Step = {
  title: string;
  route: string;
};

export type StepData = {
  previousRoute: string;
  nextRoute: string;
  title: string;
  nextTitle: string;
};

export const steps: Step[] = [
  {
    title: "Identification de la structure",
    route: "01-identification",
  },
  { title: "Adresses", route: "02-adresses" },
  {
    title: "Types de places",
    route: "03-type-places",
  },
  { title: "Finance", route: "04-finance" },
  {
    title: "Contrôle qualité & actes administratifs",
    route: "05-qualite",
  },
  { title: "Notes", route: "06-notes" },
];

export const getCurrentStepData = (
  currentStep: number,
  structureId: number
): StepData => {
  const structurePath = `/structures/${structureId}/`;
  const currentPath = `${structurePath}finalisation/`;

  let previousRoute = "";

  const previousStep = currentStep - 2;
  previousRoute =
    previousStep >= 0
      ? `${currentPath}${steps[previousStep].route}`
      : `${structurePath}`;

  const nextStep = currentStep;
  const nextRoute =
    nextStep < steps.length ? `${currentPath}${steps[nextStep].route}` : "";
  const title = steps[currentStep - 1].title;
  const nextTitle = nextStep < steps.length ? steps[nextStep].title : "";

  return { previousRoute, nextRoute, title, nextTitle };
};

export default function Steps({ currentStep, structureId }: StepsProps) {
  const { title, nextTitle } = getCurrentStepData(currentStep, structureId);
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

interface StepsProps {
  currentStep: number;
  structureId: number;
}
