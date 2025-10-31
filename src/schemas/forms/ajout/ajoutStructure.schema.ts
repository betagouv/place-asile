import z from "zod";

import { StructureType } from "@/types/structure.type";

const departementSchema = z.object({
  numero: z.string(),
  name: z.string(),
});

const operateurSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

const structureOfiiSchema = z.object({
  dnaCode: z.string(),
  nom: z.string(),
  type: z.nativeEnum(StructureType),
  operateur: operateurSchema,
  departement: departementSchema,
});

export const ajoutStructureSchema = z.object({
  departement: departementSchema,
  operateur: operateurSchema,
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.nativeEnum(StructureType)
  ),
  structureOfii: structureOfiiSchema,
});

export type StructureOfiiFormType = z.infer<typeof structureOfiiSchema>;
