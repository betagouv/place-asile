import {
    AuthorType,
    StepStatus,
} from "@prisma/client";

import prisma from "@/lib/prisma";
import { AuthorType as CustomAuthorType } from "@/types/form.type";

export const createFormDefinition = async (data: {
    name: string;
    version: number;
}) => {
    return prisma.formDefinition.create({ data });
};

export const createFormStepDefinition = async (data: {
    formDefinitionId: number;
    label: string;
    authorType: AuthorType;
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

export const convertToAuthorType = (
    authorType: string | null | undefined
): AuthorType => {
    if (!authorType) return AuthorType.OPERATEUR;
    const authorTypes: Record<string, AuthorType> = {
        'operateur': AuthorType.OPERATEUR,
        'agent': AuthorType.AGENT,
    };
    return authorTypes[authorType.trim().toLowerCase()] || AuthorType.OPERATEUR;
};

//  Convert before sending to Prisma
export const convertCustomAuthorTypeToPrisma = (
    customType: CustomAuthorType
): AuthorType => {
    switch (customType) {
        case CustomAuthorType.OPERATEUR:
            return AuthorType.OPERATEUR;
        case CustomAuthorType.AGENT:
            return AuthorType.AGENT;
        default:
            return AuthorType.OPERATEUR;
    }
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