import prisma from "@/lib/prisma";

import { AuthorType, Form, FormDefinition, FormStep, FormStepDefinition, StepStatus } from "./form.types";

// FormDefinition operations
export const createFormDefinition = async (data: {
    name: string;
    version: number;
    authorType: string;
    description?: string;
}): Promise<FormDefinition> => {
    return prisma.formDefinition.create({
        data,
    });
};

export const findFormDefinition = async (name: string, version: number): Promise<FormDefinition | null> => {
    return prisma.formDefinition.findUnique({
        where: {
            name_version: {
                name,
                version,
            },
        },
    });
};

// FormStepDefinition operations
export const createFormStepDefinition = async (data: {
    formDefinitionId: number;
    label: string;
    description?: string;
    authorType: AuthorType;
}): Promise<FormStepDefinition> => {
    return prisma.formStepDefinition.create({
        data,
    });
};

export const findFormStepDefinition = async (formDefinitionId: number, label: string): Promise<FormStepDefinition | null> => {
    return prisma.formStepDefinition.findUnique({
        where: {
            formDefinitionId_label: {
                formDefinitionId,
                label,
            },
        },
    });
};

// Form operations
export const createForm = async (data: {
    structureCodeDna: string;
    formDefinitionId: number;
}): Promise<Form> => {
    return prisma.form.create({
        data,
    });
};

export const findForm = async (structureCodeDna: string, formDefinitionId: number): Promise<Form | null> => {
    return prisma.form.findUnique({
        where: {
            structureCodeDna_formDefinitionId: {
                structureCodeDna,
                formDefinitionId,
            },
        },
        include: {
            formDefinition: true,
        },
    });
};

// FormStep operations
export const createFormStep = async (data: {
    formId: number;
    stepDefinitionId: number;
    data?: Record<string, unknown>;
}): Promise<FormStep> => {
    return prisma.formStep.create({
        data,
    });
};

export const findFormStep = async (formId: number, stepDefinitionId: number): Promise<FormStep | null> => {
    return prisma.formStep.findUnique({
        where: {
            formId_stepDefinitionId: {
                formId,
                stepDefinitionId,
            },
        },
        include: {
            stepDefinition: true,
        },
    });
};

export const updateFormStep = async (
    formId: number,
    stepDefinitionId: number,
    data: {
        data?: Record<string, unknown>;
        status?: StepStatus;
    }
): Promise<FormStep> => {
    return prisma.formStep.update({
        where: {
            formId_stepDefinitionId: {
                formId,
                stepDefinitionId,
            },
        },
        data,
        include: {
            stepDefinition: true,
        },
    });
};