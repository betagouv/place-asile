"use client";

import { ReactElement } from "react";
import Steps from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";
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
