import z from "zod";

export const operateurApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  name: z.string().min(1, "Le nom de l'opérateur est requis"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const operateursApiSchema = z.array(operateurApiSchema);

export type OperateurApiType = z.infer<typeof operateurApiSchema>;
export type OperateursApiType = z.infer<typeof operateursApiSchema>;
