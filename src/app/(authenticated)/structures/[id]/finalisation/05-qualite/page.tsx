"use client";
import { ReactElement } from "react";
import Steps from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";
import { FinalisationQualiteForm } from "./FinalisationQualiteForm";

export default function Qualite(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 5;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationQualiteForm currentStep={currentStep} />
    </>
  );
}
