import {
    createForm,
    createFormDefinition,
    createFormStep,
    createFormStepDefinition,
    findForm,
    findFormDefinition,
    findFormStep,
    findFormStepDefinition,
    updateFormStep,
} from "./form.repository";
import {
    AuthorType,
    Form,
    FormDefinition,
    FormStep,
    FormStepDefinition,
    StepStatus,
    CreateFormDefinitionRequest,
    CreateFormRequest,
    CreateFormStepDefinitionRequest,
    CreateFormStepRequest,
    GetFormRequest,
    GetFormStepRequest,
    UpdateFormStepDataRequest,
    ValidateStepRequest,
} from "./form.types";

// Service pour FormDefinition
export const ensureFormDefinition = async (data: CreateFormDefinitionRequest): Promise<FormDefinition> => {
    const existing = await findFormDefinition(data.name, data.version);
    if (existing) {
        return existing;
    }
    return createFormDefinition(data);
};

// Service pour FormStepDefinition
export const ensureFormStepDefinition = async (data: CreateFormStepDefinitionRequest): Promise<FormStepDefinition> => {
    const existing = await findFormStepDefinition(data.formDefinitionId, data.label);
    if (existing) {
        return existing;
    }
    return createFormStepDefinition(data);
};

// Service pour Form
export const ensureForm = async (data: CreateFormRequest): Promise<Form> => {
    const existing = await findForm(data.structureCodeDna, data.formDefinitionId);
    if (existing) {
        return existing;
    }
    return createForm(data);
};

// Service pour FormStep
export const ensureFormStep = async (data: CreateFormStepRequest): Promise<FormStep> => {
    const existing = await findFormStep(data.formId, data.stepDefinitionId);
    if (existing) {
        return existing;
    }
    return createFormStep(data);
};

// Service principal pour valider une étape
export const validateStep = async (request: ValidateStepRequest): Promise<FormStep> => {
    // 1. S'assurer que FormDefinition existe
    const formDefinition = await ensureFormDefinition({
        name: request.formName,
        version: request.formVersion,
        authorType: "AUTRE" as AuthorType, // Valeur par défaut
    });

    // 2. S'assurer que FormStepDefinition existe
    const stepDefinition = await ensureFormStepDefinition({
        formDefinitionId: formDefinition.id,
        label: request.stepLabel,
        authorType: "AUTRE" as AuthorType,
    });

    // 3. S'assurer que Form existe
    const form = await ensureForm({
        structureCodeDna: request.structureCodeDna,
        formDefinitionId: formDefinition.id,
    });

    // 4. S'assurer que FormStep existe
    const formStep = await ensureFormStep({
        formId: form.id,
        stepDefinitionId: stepDefinition.id,
        data: request.data,
    });

    return formStep;
};

// Service pour récupérer un form
export const getForm = async (request: GetFormRequest): Promise<Form | null> => {
    const formDefinition = await findFormDefinition(request.formName, request.formVersion);
    if (!formDefinition) {
        return null;
    }

    return findForm(request.structureCodeDna, formDefinition.id);
};

// Service pour récupérer une étape
export const getFormStep = async (request: GetFormStepRequest): Promise<FormStep | null> => {
    const formDefinition = await findFormDefinition(request.formName, request.formVersion);
    if (!formDefinition) {
        return null;
    }

    const form = await findForm(request.structureCodeDna, formDefinition.id);
    if (!form) {
        return null;
    }

    const stepDefinition = await findFormStepDefinition(formDefinition.id, request.stepLabel);
    if (!stepDefinition) {
        return null;
    }

    return findFormStep(form.id, stepDefinition.id);
};

// Service pour mettre à jour une étape
export const updateFormStepData = async (request: UpdateFormStepDataRequest): Promise<FormStep | null> => {
    const formDefinition = await findFormDefinition(request.formName, request.formVersion);
    if (!formDefinition) {
        return null;
    }

    const form = await findForm(request.structureCodeDna, formDefinition.id);
    if (!form) {
        return null;
    }

    const stepDefinition = await findFormStepDefinition(formDefinition.id, request.stepLabel);
    if (!stepDefinition) {
        return null;
    }

    return updateFormStep(form.id, stepDefinition.id, {
        data: request.data,
        status: request.status as StepStatus,
    });
};