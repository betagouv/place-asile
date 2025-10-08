import z from "zod";

import { Repartition } from "@/types/adresse.type";

export const adresseTypologieSchema = z.object({
  date: z.string().min(1),
  placesAutorisees: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0)
    )
    .optional(),
  qpv: z.boolean().optional(),
  logementSocial: z.boolean().optional(),
});

export const adresseSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  adresseComplete: z.string().optional(),
  adresse: z.string().min(1),
  codePostal: z.string().min(1),
  commune: z.string().min(1),
  departement: z.string().optional(),
  repartition: z.nativeEnum(Repartition),
  adresseTypologies: z.array(adresseTypologieSchema).optional(),
});

export type FormAdresseTypologie = z.infer<typeof adresseTypologieSchema>;

export type FormAdresse = z.infer<typeof adresseSchema>;
