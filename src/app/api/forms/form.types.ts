import { StepStatus } from "@/types/form.type";

export {
    StepStatus,
};

export type CreateForm = {
    slug: string;
    status: boolean;
    formSteps: UpdateFormStep[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type CreateFormStep = {
    slug: string;
    status: StepStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export type UpdateFormStep = CreateFormStep & {
    id?: number;
    formId?: number; // Optionnel car fourni par contexte
    slug: string;
};

export type UpdateForm = CreateForm & {
    id?: number;
    slug: string;
    formSteps: UpdateFormStep[];
};
