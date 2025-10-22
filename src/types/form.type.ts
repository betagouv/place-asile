export type Form = {
    id: number;
    structureCodeDna: string;
    formDefinitionId: number;
    status: boolean;
    formSteps?: FormStep[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type FormDefinition = {
    id: number;
    name: string;
    version: number;
    formStepDefinitions?: FormStepDefinition[];
    forms?: Form[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type FormStep = {
    id: number;
    formId: number;
    stepDefinitionId: number;
    status: StepStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export type FormStepDefinition = {
    id: number;
    formDefinitionId: number;
    label: string;
    authorType: AuthorType;
    formSteps?: FormStep[];
    createdAt?: Date;
    updatedAt?: Date;
};

export enum AuthorType {
    OPERATEUR = "operateur",
    AGENT = "agent",
}

export enum StepStatus {
    NON_COMMENCE = "non_commence",
    COMMENCE = "commence",
    A_VERIFIER = "a_verifier",
    FINALISE = "finalise",
    VALIDE = "valide",
}