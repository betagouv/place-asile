import z from "zod";

import { optionalFrenchDateToISO } from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";

import { structureBaseSchema } from "./structure.base.schema";

export const typologieItemBaseSchema = z.object({
  placesAutorisees: zSafeDecimals(),
  pmr: zSafeDecimals(),
  lgbt: zSafeDecimals(),
  fvvTeh: zSafeDecimals(),
  year: z.number().int().positive(),
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
  placesACreer: zSafeDecimals(),
  placesAFermer: zSafeDecimals(),
  echeancePlacesACreer: optionalFrenchDateToISO(),
  echeancePlacesAFermer: optionalFrenchDateToISO(),
});

export const placesEvolutionAutoSaveSchema = placesEvolutionSchema.partial();

const baseTypePlacesSchema = structureBaseSchema
  .extend({
    structureTypologies: z.array(typologieItemWithIdSchema),
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
