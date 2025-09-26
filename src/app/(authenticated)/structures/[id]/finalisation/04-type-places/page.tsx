"use client";
import { ReactElement } from "react";

import { useStructureContext } from "../../context/StructureClientContext";
import Steps from "../components/Steps";
import FinalisationTypePlacesForm from "./FinalisationTypePlacesForm";

export default function TypePlaces(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 4;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationTypePlacesForm currentStep={currentStep} />
    </>
  );
}
