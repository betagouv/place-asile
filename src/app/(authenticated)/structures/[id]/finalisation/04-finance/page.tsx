import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function Finance(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={4} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
