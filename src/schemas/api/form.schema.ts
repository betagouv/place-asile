import z from "zod";

import { StepStatus } from "@/types/form.type";

const formDefinitionApiSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  version: z.number(),
});

const stepDefinitionApiSchema = z.object({
  id: z.number(),
  slug: z.string(),
  label: z.string(),
});
const formStepApiSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(StepStatus),
  stepDefinition: stepDefinitionApiSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const formApiSchema = z.object({
  id: z.number(),
  status: z.boolean(),
  formDefinition: formDefinitionApiSchema,
  formSteps: z.array(formStepApiSchema),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type FormApiType = z.infer<typeof formApiSchema>;
export type FormStepApiType = z.infer<typeof formStepApiSchema>;
