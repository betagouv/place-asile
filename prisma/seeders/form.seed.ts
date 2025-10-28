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
): Omit<FormStepDefinition, "id"> => {
    return {
        formDefinitionId,
        label: faker.lorem.word(),
        slug: faker.lorem.slug(),
    };
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
        formSteps: stepDefinitionIds.map(stepDefinitionId =>
            createFakeFormStep(stepDefinitionId)
        ),
    };
};