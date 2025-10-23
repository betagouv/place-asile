import prisma from "@/lib/prisma";
import { AuthorType, StepStatus } from "@/types/form.type";

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
        data: {
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

// Nouvelle fonction pour s'assurer qu'une FormDefinition existe
export const ensureFormDefinitionExists = async (
    formDefinition: { name: string; version: number }
): Promise<number> => {
    const existing = await prisma.formDefinition.findUnique({
        where: {
            name_version: {
                name: formDefinition.name,
                version: formDefinition.version,
            }
        }
    });

    if (existing) return existing.id;

    const created = await prisma.formDefinition.create({
        data: {
            name: formDefinition.name,
            version: formDefinition.version,
        }
    });

    return created.id;
};

// Nouvelle fonction pour s'assurer qu'une FormStepDefinition existe
export const ensureFormStepDefinitionExists = async (
    stepDefinition: { formDefinitionId: number; label: string; authorType: string }
): Promise<number> => {
    const existing = await prisma.formStepDefinition.findUnique({
        where: {
            formDefinitionId_label: {
                formDefinitionId: stepDefinition.formDefinitionId,
                label: stepDefinition.label,
            }
        }
    });

    if (existing) return existing.id;

    const created = await prisma.formStepDefinition.create({
        data: {
            formDefinitionId: stepDefinition.formDefinitionId,
            label: stepDefinition.label,
            authorType: convertToAuthorType(stepDefinition.authorType),
        }
    });

    return created.id;
};

export const createOrUpdateFormSteps = async (
    formId: number,
    formSteps: UpdateFormStep[] | undefined
): Promise<void> => {
    if (!formSteps) return;

    await Promise.all(formSteps.map(async (formStep) => {
        return prisma.formStep.upsert({
            where: {
                formId_stepDefinitionId: {
                    formId: formId,
                    stepDefinitionId: formStep.stepDefinitionId,
                }
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
    // ✅ Gérer undefined directement dans la fonction
    if (!forms || forms.length === 0) return;

    await Promise.all(forms.map(async (form) => {
        await createCompleteFormWithSteps(structureCodeDna, {
            formDefinition: form.formDefinition,
            status: form.status,
            formSteps: (form.formSteps || []).map(step => ({
                stepDefinitionId: step.stepDefinitionId,
                status: step.status,
                stepDefinition: {
                    label: step.stepDefinition?.label || `Step ${step.stepDefinitionId}`,
                    authorType: step.stepDefinition?.authorType || AuthorType.OPERATEUR,
                }
            }))
        });
    }));
};

export const createCompleteFormWithSteps = async (
    structureCodeDna: string,
    formData: {
        formDefinition: { name: string; version: number };
        status: boolean;
        formSteps: Array<{
            stepDefinitionId: number;
            status: StepStatus;
            stepDefinition?: {
                label: string;
                authorType: AuthorType;
            };
        }>;
    }
): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        // 1. Créer ou récupérer la FormDefinition
        const formDefinitionId = await ensureFormDefinitionExists(formData.formDefinition);

        // 2. Créer ou mettre à jour le Form
        const form = await tx.form.upsert({
            where: {
                structureCodeDna_formDefinitionId: {
                    structureCodeDna: structureCodeDna,
                    formDefinitionId: formDefinitionId,
                }
            },
            update: {
                status: formData.status,
            },
            create: {
                formDefinitionId: formDefinitionId,
                structureCodeDna: structureCodeDna,
                status: formData.status,
            }
        });

        // 3. ✅ AJOUTER: Créer les FormStepDefinition si nécessaire
        if (formData.formSteps) {
            for (const step of formData.formSteps) {
                if (step.stepDefinition) {
                    await ensureFormStepDefinitionExists({
                        formDefinitionId: formDefinitionId,
                        label: step.stepDefinition.label,
                        authorType: step.stepDefinition.authorType,
                    });
                }
            }
        }

        // 4. Créer ou mettre à jour les FormSteps
        if (formData.formSteps) {
            await Promise.all(formData.formSteps.map(async (step) => {
                await tx.formStep.upsert({
                    where: {
                        formId_stepDefinitionId: {
                            formId: form.id,
                            stepDefinitionId: step.stepDefinitionId,
                        }
                    },
                    update: {
                        status: convertToStepStatus(step.status),
                    },
                    create: {
                        formId: form.id,
                        stepDefinitionId: step.stepDefinitionId,
                        status: convertToStepStatus(step.status),
                    }
                });
            }));
        }
    });
};