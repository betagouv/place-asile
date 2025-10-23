import {
    StepStatus,
} from "@prisma/client";

import prisma from "@/lib/prisma";

export const createFormDefinition = async (data: {
    name: string;
    version: number;
}) => {
    return prisma.formDefinition.create({ data });
};

export const createFormStepDefinition = async (data: {
    formDefinitionId: number;
    label: string;
}) => {
    return prisma.formStepDefinition.create({ data });
};

export const createFormStep = async (data: {
    formId: number;
    stepDefinitionId: number;
    status: StepStatus;
}) => {
    return prisma.formStep.create({ data });
};

export const convertToStepStatus = (
    stepStatus: string | null | undefined
): StepStatus => {
    if (!stepStatus) return StepStatus.NON_COMMENCE;
    const stepStatuses: Record<string, StepStatus> = {
        'non_commence': StepStatus.NON_COMMENCE,
        'commence': StepStatus.COMMENCE,
        'a_verifier': StepStatus.A_VERIFIER,
        'finalise': StepStatus.FINALISE,
        'valide': StepStatus.VALIDE,
    };
    return stepStatuses[stepStatus.trim().toLowerCase()] || StepStatus.NON_COMMENCE;
};