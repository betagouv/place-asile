import { ReactElement } from "react";
import Steps from "../components/Steps";
import { FormIdentificationFinalisation } from "./(form)/FormIdentificationFinalisation";

export default async function Identification(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={1} />
      <FormIdentificationFinalisation />
    </>
  );
}
