import z from "zod";

import { Repartition } from "@/types/adresse.type";

export const adresseTypologieApiSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  date: z.string().datetime({
    message: "La date de la typologie d'adresse est requise",
  }),
  qpv: z.number().int(),
  logementSocial: z.number().int(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const adresseApiSchema = z.object({
  id: z.number().optional(),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  commune: z.string().optional(),
  repartition: z.nativeEnum(Repartition).optional(),
  adresseTypologies: z.array(adresseTypologieApiSchema),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type AdresseApiType = z.infer<typeof adresseApiSchema>;
export type AdresseTypologieApiType = z.infer<typeof adresseTypologieApiSchema>;
