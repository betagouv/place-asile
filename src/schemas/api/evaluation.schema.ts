import z from "zod";

export const evaluationApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  date: z.string().datetime().optional(),
  notePersonne: z.number().optional(),
  notePro: z.number().optional(),
  noteStructure: z.number().optional(),
  note: z.number().optional(),
});

export type EvaluationApiType = z.infer<typeof evaluationApiSchema>;
