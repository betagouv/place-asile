import { fakerFR as faker } from "@faker-js/faker";
import {
  Form,
  FormDefinition,
  FormStep,
  FormStepDefinition,
  StepStatus,
} from "@prisma/client";

export const createFakeFormDefinition = (): Omit<FormDefinition, "id"> => {
  return {
    name: "finalisation",
    slug: "finalisation-v1",
    version: 1,
  };
};

export const createFakeFormStepDefinition = (
  formDefinitionId: number
): Omit<FormStepDefinition, "id">[] => {
  return [
    {
      formDefinitionId,
      label: "01-identification",
      slug: "01-identification",
    },
    {
      formDefinitionId,
      label: "02-documents-financiers",
      slug: "02-documents-financiers",
    },
    {
      formDefinitionId,
      label: "03-finance",
      slug: "03-finance",
    },
    {
      formDefinitionId,
      label: "04-controles",
      slug: "04-controles",
    },
    {
      formDefinitionId,
      label: "05-documents",
      slug: "05-documents",
    },
    {
      formDefinitionId,
      label: "06-notes",
      slug: "06-notes",
    },
  ];
};

export const createFakeForm = (
  formDefinitionId: number
): Omit<Form, "id" | "structureCodeDna"> => {
  return {
    formDefinitionId: formDefinitionId,
    status: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

export const createFakeFormStep = (
  stepDefinitionId: number
): Omit<FormStep, "id" | "formId"> => {
  return {
    stepDefinitionId: stepDefinitionId,
    status: faker.helpers.enumValue(StepStatus),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

type FormWithSteps = Form & {
  formSteps: Omit<FormStep, "id" | "formId">[];
};

export const createFakeFormWithSteps = (
  formDefinitionId: number,
  stepDefinitionIds: number[]
): Omit<FormWithSteps, "id" | "structureCodeDna"> => {
  const fakeForm = createFakeForm(formDefinitionId);

  return {
    ...fakeForm,
    formSteps: stepDefinitionIds.map((stepDefinitionId) =>
      createFakeFormStep(stepDefinitionId)
    ),
  };
};
