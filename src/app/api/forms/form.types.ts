import { StepStatus } from "@/types/form.type";

export {
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
    formId?: number; // Optionnel car fourni par contexte
    stepDefinitionId: number;
    stepDefinition?: {
        label: string;
    };
};

export type UpdateForm = CreateForm & {
    id?: number;
    formDefinition: {
        name: string;
        version: number;
        id?: number;
    };
    formSteps: UpdateFormStep[];
};
