import { FormStep } from "./form-step.type";

export type FormStepDefinition = {
    id: number;
    formDefinitionId: number;
    label: string;
    authorType: AuthorType;
    formSteps: FormStep[];
    createdAt?: Date;
    updatedAt?: Date;
}

export enum AuthorType {
    OPERATEUR = "OPERATEUR",
    AGENT = "AGENT",
}