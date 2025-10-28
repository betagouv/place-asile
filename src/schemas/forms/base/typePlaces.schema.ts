import z from "zod";

import {
  frenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

import { structureBaseSchema } from "./structure.base.schema";

const numericField = (fieldName: string) =>
  z.union([
    z
      .string()
      .min(1, { message: `${fieldName} requis` })
      .transform(Number),
    z.number().min(0, { message: `${fieldName} requis` }),
  ]);

export const typologieItemBaseSchema = z.object({
  placesAutorisees: numericField("Nombre de places"),
  pmr: numericField("Nombre de places PMR"),
  lgbt: numericField("Nombre de places LGBT"),
  fvvTeh: numericField("Nombre de places FVV/TEH"),
  date: frenchDateToISO(),
});

export const typologieItemWithIdSchema = typologieItemBaseSchema.extend({
  id: z.number().optional(),
});

export const placesEvolutionSchema = z.object({
  placesACreer: zSafeNumber(),
  placesAFermer: zSafeNumber(),
  echeancePlacesACreer: optionalFrenchDateToISO(),
  echeancePlacesAFermer: optionalFrenchDateToISO(),
});

const baseTypePlacesSchema = structureBaseSchema
  .extend({
    typologies: z.array(typologieItemWithIdSchema),
  })
  .merge(placesEvolutionSchema);

export const typePlacesSchema = baseTypePlacesSchema
  .refine(
    (data) => {
      return data.placesACreer <= 0 || !!data.echeancePlacesACreer;
    },
    {
      message: "Ce champ est obligatoire s'il y a au moins une place à créer",
      path: ["echeancePlacesACreer"],
    }
  )
  .refine(
    (data) => {
      return data.placesAFermer <= 0 || !!data.echeancePlacesAFermer;
    },
    {
      message: "Ce champ est obligatoire s'il y a au moins une place à fermer",
      path: ["echeancePlacesAFermer"],
    }
  );

export const typePlacesAutoSaveSchema = baseTypePlacesSchema.partial();

export type TypePlacesFormValues = z.infer<typeof typePlacesSchema>;
export type PlacesEvolutionFormValues = z.infer<typeof placesEvolutionSchema>;
