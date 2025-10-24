import z from "zod";

import { Repartition } from "@/types/adresse.type";

export const adresseTypologieApiSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  date: z.coerce.date({
    message: "La date de la typologie d'adresse est requise",
  }),
  qpv: z.number().int(),
  logementSocial: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const adresseApiSchema = z.object({
  id: z.number().optional(),
  adresse: z.string().min(1, "L'adresse du logement est requise"),
  codePostal: z.string().min(1, "Le code postal du logement est requis"),
  commune: z.string().min(1, "Le code postal du logement est requis"),
  repartition: z.nativeEnum(Repartition),
  adresseTypologies: z.array(adresseTypologieApiSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type AdresseApiType = z.infer<typeof adresseApiSchema>;
export type AdresseTypologieApiType = z.infer<typeof adresseTypologieApiSchema>;
