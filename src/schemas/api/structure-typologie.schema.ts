import z from "zod";

export const structureTypologieApiSchema = z.object({
  id: z.number().optional(),
  date: z.string().datetime({ message: "La date de la typologie est requise" }),
  placesAutorisees: z.number().int(),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
  placesACreer: z.number().int().optional(),
  placesAFermer: z.number().int().optional(),
  echeancePlacesACreer: z.string().datetime().optional(),
  echeancePlacesAFermer: z.string().datetime().optional(),
});

export type StructureTypologieApiType = z.infer<
  typeof structureTypologieApiSchema
>;
