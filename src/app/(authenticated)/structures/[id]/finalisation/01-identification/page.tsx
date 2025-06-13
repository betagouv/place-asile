import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function Identification(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={1} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
