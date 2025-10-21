import { z } from "zod";

import { AuthorType, StepStatus } from "./form.types";

// Schémas pour FormDefinition
export const createFormDefinitionSchema = z.object({
    name: z.string().min(1),
    version: z.number().int().positive(),
    authorType: z.nativeEnum(AuthorType),
});

// Schémas pour FormStepDefinition
export const createFormStepDefinitionSchema = z.object({
    formDefinitionId: z.number().int().positive(),
    label: z.string().min(1),
    authorType: z.nativeEnum(AuthorType),
});

// Schémas pour Form
export const createFormSchema = z.object({
    structureCodeDna: z.string().min(1),
    formDefinitionId: z.number().int().positive(),
});

// Schémas pour FormStep
export const createFormStepSchema = z.object({
    formId: z.number().int().positive(),
    stepDefinitionId: z.number().int().positive(),
    data: z.record(z.unknown()).optional(),
});

export const updateFormStepSchema = z.object({
    formId: z.number().int().positive(),
    stepDefinitionId: z.number().int().positive(),
    data: z.record(z.unknown()).optional(),
    status: z.nativeEnum(StepStatus).optional(),
});

// Schémas pour les requêtes API
export const validateStepSchema = z.object({
    structureCodeDna: z.string().min(1),
    formName: z.string().min(1),
    formVersion: z.number().int().positive(),
    stepLabel: z.string().min(1),
    data: z.record(z.unknown()).optional(),
});

export const getFormSchema = z.object({
    structureCodeDna: z.string().min(1),
    formName: z.string().min(1),
    formVersion: z.number().int().positive(),
});

export const getFormStepSchema = z.object({
    structureCodeDna: z.string().min(1),
    formName: z.string().min(1),
    formVersion: z.number().int().positive(),
    stepLabel: z.string().min(1),
});

export const updateFormStepDataSchema = z.object({
    structureCodeDna: z.string().min(1),
    formName: z.string().min(1),
    formVersion: z.number().int().positive(),
    stepLabel: z.string().min(1),
    data: z.record(z.unknown()).optional(),
    status: z.nativeEnum(StepStatus).optional(),
});