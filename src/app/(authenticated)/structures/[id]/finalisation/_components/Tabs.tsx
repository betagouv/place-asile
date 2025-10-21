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
    type: "verification",
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
    type: "verification",
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
    type: "completion",
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
    type: "completion",
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
    type: "completion",
  },
  {
    title: <>Notes</>,
    route: "06-notes",
    type: "completion",
  },
];

export const Tabs = ({ structure, currentStep }: Props) => {
  return (
    <div className="grid grid-cols-6 gap-1 mb-[-1px]">
      {steps.map((step) => (
        <Tab
          key={step.route}
          title={step.title}
          type={step.type}
          route={`/structures/${structure.id}/finalisation/${step.route}`}
          current={step.route === currentStep}
        />
      ))}
    </div>
  );
};

type Props = {
  currentStep: string;
  structure: Structure;
};

type Step = {
  title: ReactNode;
  route: string;
  type: "verification" | "completion";
};
