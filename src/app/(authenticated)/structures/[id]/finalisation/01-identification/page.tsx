import { ReactElement } from "react";
import Steps from "../components/Steps";
import IdentificationForm from "../forms/IdentificationForm";

export default async function Identification(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={1} />
      <IdentificationForm />
    </>
  );
}
