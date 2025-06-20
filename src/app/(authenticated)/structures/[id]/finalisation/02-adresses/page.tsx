import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function Adresses(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={2} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
