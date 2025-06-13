import { ReactElement } from "react";
import Steps from "../components/Steps";

export default async function TypePlaces(): Promise<ReactElement> {
  return (
    <>
      <Steps currentStep={3} />
      {/* TODO @ledjay : add form */}
    </>
  );
}
