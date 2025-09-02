"use client";
import { ReactElement } from "react";

import { useStructureContext } from "../../context/StructureClientContext";
import Steps from "../components/Steps";
import FinalisationIdentificationForm from "./forms/FinalisationIdentificationForm";

export default function Identification(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 1;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationIdentificationForm currentStep={currentStep} />
    </>
  );
}
