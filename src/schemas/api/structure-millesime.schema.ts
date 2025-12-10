import z from "zod";

export const structureMillesimeApiSchema = z.object({
  id: z.number().optional(),
  year: z.number().int().positive(),
  cpom: z.boolean(),
  operateurComment: z.string().nullish(),
});

export type StructureMillesimeApiType = z.infer<
  typeof structureMillesimeApiSchema
>;
