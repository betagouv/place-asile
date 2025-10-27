import z from "zod";

export const structureTypologieApiSchema = z.object({
  id: z.number().optional(),
  date: z.string().datetime({ message: "La date de la typologie est requise" }),
  placesAutorisees: z.number().int(),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
});

export type StructureTypologieApiType = z.infer<
  typeof structureTypologieApiSchema
>;
