import z from "zod";

import { zSafeYear } from "@/app/utils/zodCustomFields";
import { Repartition } from "@/types/adresse.type";

export const adresseTypologieApiSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  year: zSafeYear(),
  qpv: z.number().int(),
  logementSocial: z.number().int(),
});

export const adresseApiSchema = z.object({
  id: z.number().optional(),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  commune: z.string().optional(),
  repartition: z.nativeEnum(Repartition).optional(),
  adresseTypologies: z.array(adresseTypologieApiSchema),
});

export type AdresseApiType = z.infer<typeof adresseApiSchema>;
export type AdresseTypologieApiType = z.infer<typeof adresseTypologieApiSchema>;
