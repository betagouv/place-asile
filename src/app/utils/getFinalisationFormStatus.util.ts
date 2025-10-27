import { StructureApiType } from "@/schemas/api/structure.schema";
import { StepStatus } from "@/types/form.type";

export const FINALISATION_FORM_LABEL = "finalisation";
export const FINALISATION_FORM_VERSION = 1;

export const getFinalisationFormStepStatus = (
  route: string,
  structure: StructureApiType
) => {
  const finalisationForm = structure.forms?.find(
    (form) =>
      form.formDefinition.name === FINALISATION_FORM_LABEL &&
      form.formDefinition.version === FINALISATION_FORM_VERSION
  );

  if (!finalisationForm) {
    return StepStatus.NON_COMMENCE;
  }

  const currentFormStep = finalisationForm.formSteps?.find((step) => {
    return step.stepDefinition.label === route;
  });

  if (!currentFormStep) {
    return StepStatus.NON_COMMENCE;
  }

  return currentFormStep.status;
};

export const getFinalisationFormStatus = (structure: StructureApiType) => {
  const finalisationForm = structure.forms?.find(
    (form) =>
      form.formDefinition?.name === FINALISATION_FORM_LABEL &&
      form.formDefinition?.version === FINALISATION_FORM_VERSION
  );

  if (!finalisationForm) {
    return false;
  }

  return finalisationForm.status;
};
