"use client";
import { ReactElement } from "react";
import Steps from "../components/Steps";
import FinalisationTypePlacesForm from "./FinalisationTypePlacesForm";
import { useStructureContext } from "../../context/StructureClientContext";

export default function TypePlaces(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 3;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationTypePlacesForm currentStep={currentStep} />
    </>
  );
}
