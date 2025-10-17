import { ReactNode } from "react";

import { Structure } from "@/types/structure.type";

import { Tab } from "./Tab";

export const steps: Step[] = [
  {
    title: (
      <>
        Identification
        <br />
        de la structure
      </>
    ),
    route: "01-identification",
  },
  {
    title: (
      <>
        Documents
        <br />
        financiers
      </>
    ),
    route: "02-documents-financiers",
  },
  {
    title: (
      <>
        Analyse
        <br />
        Financière
      </>
    ),
    route: "03-finance",
  },
  {
    title: (
      <>
        Contrôle qualité
        <br />
        et objectifs
      </>
    ),
    route: "04-controles",
  },
  {
    title: (
      <>
        Actes
        <br />
        administratifs
      </>
    ),
    route: "05-documents",
  },
  {
    title: <>Notes</>,
    route: "06-notes",
  },
];

export const Tabs = ({ structure, currentStep }: Props) => {
  return (
    <div className="grid grid-cols-6 gap-1 mb-[-1px]">
      {steps.map((step, index) => (
        <Tab
          key={step.route}
          title={step.title}
          route={`/structures/${structure.id}/finalisation/${step.route}`}
          current={index + 1 === currentStep}
          structure={structure}
        />
      ))}
    </div>
  );
};

type Props = {
  currentStep: number;
  structure: Structure;
};

type Step = {
  title: ReactNode;
  route: string;
};
