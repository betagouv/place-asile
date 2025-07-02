"use client";
import { ReactElement } from "react";
import Steps from "../components/Steps";
import FinalisationAdressesForm from "./FinalisationAdressesForm";
import { useStructureContext } from "../../context/StructureClientContext";

export default function Adresses(): ReactElement {
  const { structure } = useStructureContext();
  const structureId = structure.id;
  const currentStep = 2;
  return (
    <>
      <Steps currentStep={currentStep} structureId={structureId} />
      <FinalisationAdressesForm currentStep={currentStep} />
    </>
  );
}
