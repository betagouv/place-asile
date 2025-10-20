export type FormStep = {
    id: number;
    formId: number;
    stepDefinitionId: number;
    status: StepStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum StepStatus {
    NON_COMMENCE = "NON_COMMENCE",
    COMMENCE = "COMMENCE",
    A_VERIFIER = "A_VERIFIER",
    FINALISE = "FINALISE",
    VALIDE = "VALIDE",
}