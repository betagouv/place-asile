import {
    AuthorType,
    StepStatus,
} from "@prisma/client";

import prisma from "@/lib/prisma";

export const createFormDefinition = async (data: {
    name: string;
    version: number;
    authorType: AuthorType;
    description?: string;
}) => {
    return prisma.formDefinition.create({ data });
};

export const createFormStepDefinition = async (data: {
    formDefinitionId: number;
    label: string;
    authorType: AuthorType;
    description?: string;
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

export const convertToAuthorType = (authorType: string): AuthorType => {
    if (!authorType) return AuthorType.OPERATEUR;
    const authorTypes: Record<string, AuthorType> = {
        OPERATEUR: AuthorType.OPERATEUR,
        AGENT: AuthorType.AGENT,
    };
    return authorTypes[authorType.trim().toLowerCase()];
};

export const convertToStepStatus = (stepStatus: string): StepStatus => {
    if (!stepStatus) return StepStatus.NON_COMMENCE;
    const stepStatuses: Record<string, StepStatus> = {
        NON_COMMENCE: StepStatus.NON_COMMENCE,
        COMMENCE: StepStatus.COMMENCE,
        A_VERIFIER: StepStatus.A_VERIFIER,
        FINALISE: StepStatus.FINALISE,
        VALIDE: StepStatus.VALIDE,
    };
    return stepStatuses[stepStatus.trim().toLowerCase()];
};