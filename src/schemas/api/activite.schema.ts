import z from "zod";

export const activiteApiSchema = z.object({
  id: z.number(),
  adresseId: z.number(),
  date: z.string().datetime(),
  nbPlaces: z.number(),
  desinsectisation: z.number(),
  remiseEnEtat: z.number(),
  sousOccupation: z.number(),
  travaux: z.number(),
  placesIndisponibles: z.number(),
  placesVacantes: z.number(),
  presencesInduesBPI: z.number(),
  presencesInduesDeboutees: z.number(),
  presencesIndues: z.number(),
});

export type ActiviteApiType = z.infer<typeof activiteApiSchema>;
