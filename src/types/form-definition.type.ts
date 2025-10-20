import { FormStepDefinition } from "./form-step-definition.type";

export type FormDefinition = {
    id: number;
    name: string;
    version: number;
    stepsDefinition: FormStepDefinition[];
    createdAt?: Date;
    updatedAt?: Date;
}