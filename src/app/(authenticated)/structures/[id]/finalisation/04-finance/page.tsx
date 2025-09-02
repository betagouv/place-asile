"use client";

import { ReactElement } from "react";

import { useStructureContext } from "../../context/StructureClientContext";
import Steps from "../components/Steps";
import FinalisationFinanceForm from "./FinalisationFinanceForm";

export default function Finance(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 4;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationFinanceForm currentStep={currentStep} />
    </>
  );
}
