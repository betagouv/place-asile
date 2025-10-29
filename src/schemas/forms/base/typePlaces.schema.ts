import z from "zod";

import {
  frenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

import { structureBaseSchema } from "./structure.base.schema";

export const typologieItemBaseSchema = z.object({
  placesAutorisees: zSafeNumber(),
  pmr: zSafeNumber(),
  lgbt: zSafeNumber(),
  fvvTeh: zSafeNumber(),
  date: frenchDateToISO(),
});

const typologieItemWithIdSchema = typologieItemBaseSchema.extend({
  id: z.number().optional(),
});

export const typePlacesWithoutEvolutionSchema = z.object({
  structureTypologies: z.array(typologieItemWithIdSchema),
});

export const typePlacesWithEvolutionAutoSaveSchema = z.object({
  structureTypologies: z.array(typologieItemWithIdSchema.partial()),
});

export const placesEvolutionSchema = z.object({
  placesACreer: zSafeNumber(),
  placesAFermer: zSafeNumber(),
  echeancePlacesACreer: optionalFrenchDateToISO(),
  echeancePlacesAFermer: optionalFrenchDateToISO(),
});

export const placesEvolutionAutoSaveSchema = placesEvolutionSchema.partial();

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
