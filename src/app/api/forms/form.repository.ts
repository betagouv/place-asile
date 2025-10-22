// src/app/api/forms/form.repository.ts
import prisma from "@/lib/prisma";

import {
    CreateFormDefinition,
    CreateFormStepDefinition,
    UpdateForm,
    UpdateFormStep,
} from "./form.types";
import { convertToAuthorType, convertToStepStatus } from "./form.util";

export const createFormDefinition = async (
    formDefinition: CreateFormDefinition
): Promise<void> => {
    await prisma.formDefinition.create({
        data:
        {
            name: formDefinition.name,
            version: formDefinition.version,
        }
    });
};

export const createFormStepDefinition = async (
    formStepDefinition: CreateFormStepDefinition
): Promise<void> => {
    await prisma.formStepDefinition.create({
        data: {
            formDefinitionId: formStepDefinition.formDefinitionId,
            label: formStepDefinition.label,
            authorType: convertToAuthorType(formStepDefinition.authorType),
        }
    });
};

export const createOrUpdateFormSteps = async (
    formId: number,
    formSteps: UpdateFormStep[] | undefined
): Promise<void> => {
    if (!formSteps) return;
    await Promise.all(formSteps.map(async (formStep) => {
        return prisma.formStep.upsert({
            where: {
                id: formStep.id,
            },
            update: {
                status: convertToStepStatus(formStep.status),
            },
            create: {
                formId: formId,
                stepDefinitionId: formStep.stepDefinitionId,
                status: convertToStepStatus(formStep.status),
            }
        });
    }));
};

export const createOrUpdateForms = async (
    forms: UpdateForm[] | undefined,
    structureCodeDna: string
): Promise<void> => {
    if (!forms) return;
    await Promise.all(forms.map(async (form) => {
        const createdForm = await prisma.form.upsert({
            where: {
                id: form.id,
            },
            update: {
                status: form.status,
            },
            create: {
                formDefinitionId: form.formDefinitionId,
                structureCodeDna: structureCodeDna,
                status: form.status,
            }
        });
        createOrUpdateFormSteps(createdForm.id, form.formSteps);
    }));
};
