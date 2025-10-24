export type Form = {
    id: number;
    structureCodeDna: string;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    formDefinitionId: number;
    formDefinition: FormDefinition;
    formSteps: FormStep[];
};

export type FormDefinition = {
    id: number;
    name: string;
    version: number;
};

export type FormStep = {
    id: number;
    formId: number;
    stepDefinition: FormStepDefinition;
    status: StepStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export type FormStepDefinition = {
    id: number;
    formDefinitionId: number;
    label: string;
};

export enum StepStatus {
    NON_COMMENCE = "NON_COMMENCE",
    COMMENCE = "COMMENCE",
    A_VERIFIER = "A_VERIFIER",
    FINALISE = "FINALISE",
    VALIDE = "VALIDE",
}
