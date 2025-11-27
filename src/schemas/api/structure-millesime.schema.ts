import z from "zod";
export const structureMillesimeApiSchema = z.object({
  id: z.number().optional(),
  date: z.string().datetime(),
  cpom: z.boolean(),
  operateurComment: z.string().nullish(),
});

export type StructureMillesimeApiType = z.infer<
  typeof structureMillesimeApiSchema
>;
