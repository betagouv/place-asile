// Import des types Prisma
import type {
    Form,
    FormDefinition,
    FormStep,
    FormStepDefinition,
} from "@prisma/client";

import {
    AuthorType,
    StepStatus,
} from "@prisma/client";



// Types personnalisés qui étendent Prisma
type FormWithDetails = Form & {
    formDefinition: FormDefinition;
    formSteps: (FormStep & {
        stepDefinition: FormStepDefinition;
    })[];
};

type FormStepWithDetails = FormStep & {
    stepDefinition: FormStepDefinition;
    form: Form;
};


// Réexportation des types Prisma
export type {
    Form,
    FormDefinition,
    FormStep,
    FormStepDefinition,
    FormStepWithDetails,
    FormWithDetails,
};

export {
    AuthorType,
    StepStatus,
};

// Types spécifiques aux forms (API requests)
export interface CreateFormDefinitionRequest {
    name: string;
    version: number;
    authorType: AuthorType;
    description?: string;
}

export interface CreateFormStepDefinitionRequest {
    formDefinitionId: number;
    label: string;
    description?: string;
    authorType: AuthorType;
}

export interface CreateFormRequest {
    structureCodeDna: string;
    formDefinitionId: number;
}

export interface CreateFormStepRequest {
    formId: number;
    stepDefinitionId: number;
    data?: Record<string, unknown>;
}

export interface ValidateStepRequest {
    structureCodeDna: string;
    formName: string;
    formVersion: number;
    stepLabel: string;
    data?: Record<string, unknown>;
}

export interface GetFormRequest {
    structureCodeDna: string;
    formName: string;
    formVersion: number;
}

export interface GetFormStepRequest {
    structureCodeDna: string;
    formName: string;
    formVersion: number;
    stepLabel: string;
}

export interface UpdateFormStepDataRequest {
    structureCodeDna: string;
    formName: string;
    formVersion: number;
    stepLabel: string;
    data?: Record<string, unknown>;
    status?: StepStatus;
}