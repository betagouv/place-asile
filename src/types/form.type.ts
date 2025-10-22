export type Form = {
    id: number;
    structureCodeDna: string;
    formDefinitionId: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type FormDefinition = {
    id: number;
    name: string;
    version: number;
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
    createdAt?: Date;
    updatedAt?: Date;
};

export enum AuthorType {
    OPERATEUR = "Opérateur",
    AGENT = "Agent",
}

export enum StepStatus {
    NON_COMMENCE = "Non commencé",
    COMMENCE = "Commencé",
    A_VERIFIER = "À vérifier",
    FINALISE = "Finalisé",
    VALIDE = "Validé",
}