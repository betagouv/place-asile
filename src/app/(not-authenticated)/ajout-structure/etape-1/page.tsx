import Stepper from "@codegouvfr/react-dsfr/Stepper";
import FormInformations from "../forms/FormInformations";

export default function StepInfo() {
  return (
    <>
      <Stepper
        currentStep={1}
        nextTitle="Adresses"
        stepCount={4}
        title="Identification de la structure"
      />
      <FormInformations />
    </>
  );
}
