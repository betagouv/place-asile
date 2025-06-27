import { ReactElement } from "react";
import Steps from "../components/Steps";
import FinalisationIdentificationForm from "./forms/FinalisationIdentificationForm";

export default async function Identification(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={1} />
      <FinalisationIdentificationForm />
    </>
  );
}
