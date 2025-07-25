"use client";
import { ReactElement } from "react";
import Steps from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";
import { FinalisationNotesForm } from "./FinalisationNotesForm";

export default function Notes(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 6;

  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationNotesForm currentStep={currentStep} />
    </>
  );
}
