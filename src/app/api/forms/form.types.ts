import { AuthorType as CustomAuthorType, StepStatus } from "@/types/form.type";

export {
    CustomAuthorType,
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
    authorType: CustomAuthorType;
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
        authorType: CustomAuthorType;
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
