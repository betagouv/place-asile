// import type {
//     Form,
//     FormDefinition,
//     FormStep,
//     FormStepDefinition,
// } from "@/types/form.type";
import { AuthorType, StepStatus } from "@/types/form.type";

// export type {
//     Form,
//     FormDefinition,
//     FormStep,
//     FormStepDefinition,
// };

export {
    AuthorType,
    StepStatus,
};

export type CreateFormDefinition = {
    name: string;
    version: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type CreateFormStepDefinition = {
    formDefinitionId: number;
    label: string;
    authorType: AuthorType;
    createdAt?: Date;
    updatedAt?: Date;
};

export type UpdateFormDefinition = CreateFormDefinition & {
    id?: number;
};

export type UpdateFormStepDefinition = CreateFormStepDefinition & {
    id?: number;
};

export type CreateForm = {
    formDefinitionId: number;
    status: boolean;
    formDefinition: UpdateFormDefinition;
    formSteps: UpdateFormStep[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type CreateFormStep = {
    status: StepStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export type UpdateFormStep = CreateFormStep & {
    id?: number;
    formId: number;
    stepDefinitionId: number;
};

export type UpdateForm = CreateForm & {
    id?: number;
};
