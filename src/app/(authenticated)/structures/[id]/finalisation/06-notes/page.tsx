import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function Notes(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={6} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
