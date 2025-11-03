import z from "zod";

export const operateurApiSchema = z.object({
  id: z.number().optional(),
  structureId: z.number().optional(),
  name: z.string().min(1, "Le nom de l'opérateur est requis"),
});

export const operateursApiSchema = z.array(operateurApiSchema);

export type OperateurApiType = z.infer<typeof operateurApiSchema>;
export type OperateursApiType = z.infer<typeof operateursApiSchema>;
