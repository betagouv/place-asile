import z from "zod";

import { StepStatus } from "@/types/form.type";

const formStepApiSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  status: z.nativeEnum(StepStatus),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const formApiSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  status: z.boolean(),
  formSteps: z.array(formStepApiSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type FormApiType = z.infer<typeof formApiSchema>;
export type FormStepApiType = z.infer<typeof formStepApiSchema>;
