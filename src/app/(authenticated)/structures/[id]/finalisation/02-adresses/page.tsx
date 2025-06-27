import { ReactElement } from "react";
import Steps from "../components/Steps";
import FinalisationAdressesForm from "./FinalisationAdressesForm";

export default async function Adresses(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={2} />
      <FinalisationAdressesForm />
    </>
  );
}
