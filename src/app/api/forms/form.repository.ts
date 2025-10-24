import prisma from "@/lib/prisma";
import { StepStatus } from "@/types/form.type";

import {
    UpdateForm,
} from "./form.types";
import { convertToStepStatus } from "./form.util";

export const createOrUpdateForms = async (
    forms: UpdateForm[] | undefined,
    structureCodeDna: string
): Promise<void> => {
    if (!forms || forms.length === 0) return;

    await Promise.all(forms.map(async (form) => {
        await createCompleteFormWithSteps(structureCodeDna, {
            slug: form.slug,
            status: form.status,
            formSteps: (form.formSteps || []).map(step => ({
                slug: step.slug,
                status: step.status,
            }))
        });
    }));
};

const createCompleteFormWithSteps = async (
    structureCodeDna: string,
    formData: {
        slug: string; // formDefinition slug
        status: boolean;
        formSteps: Array<{
            slug: string; // formStepDefinition slug
            status: StepStatus;
        }>;
    }
): Promise<void> => {
    await prisma.$transaction(async (tx) => {

        // 1. Récupérer la FormDefinition par slug
        const formDefinition = await tx.formDefinition.findUnique({
            where: { slug: formData.slug },
            include: { stepsDefinition: true }
        });

        if (!formDefinition) {
            throw new Error(`FormDefinition with slug ${formData.slug} not found`);
        }

        // 2. Créer ou mettre à jour le Form
        const form = await tx.form.upsert({
            where: {
                structureCodeDna_formDefinitionId: {
                    structureCodeDna: structureCodeDna,
                    formDefinitionId: formDefinition.id,
                }
            },
            update: {
                status: formData.status,
            },
            create: {
                formDefinitionId: formDefinition.id,
                structureCodeDna: structureCodeDna,
                status: formData.status,
            }
        });

        // 3. Créer ou mettre à jour les FormSteps
        if (formData.formSteps) {
            await Promise.all(formData.formSteps.map(async (step) => {
                // 3.1. Récupérer le FormStepDefinition par slug
                const formStepDefinition = formDefinition.stepsDefinition.find(step => step.slug === step.slug);
                if (!formStepDefinition) {
                    throw new Error(`FormStepDefinition with slug ${step.slug} not found`);
                }

                // 3.2. Créer ou mettre à jour le FormStep
                await tx.formStep.upsert({
                    where: {
                        formId_stepDefinitionId: {
                            formId: form.id,
                            stepDefinitionId: formStepDefinition.id,
                        }
                    },
                    update: {
                        status: convertToStepStatus(step.status),
                    },
                    create: {
                        formId: form.id,
                        stepDefinitionId: formStepDefinition.id,
                        status: convertToStepStatus(step.status),
                    }
                });
            }));
        }
    });
};