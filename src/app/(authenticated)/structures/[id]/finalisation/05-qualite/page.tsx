"use client";
import { ReactElement } from "react";
import Steps from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";

export default function Qualite(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 5;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
