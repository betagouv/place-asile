import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function Qualite(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={5} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
