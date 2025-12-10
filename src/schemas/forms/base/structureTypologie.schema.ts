import z from "zod";

import {
  frenchDateToISO,
  optionalFrenchDateToISO,
} from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";

export const structureTypologieWithoutEvolutionSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: zSafeDecimals(),
  pmr: zSafeDecimals(),
  lgbt: zSafeDecimals(),
  fvvTeh: zSafeDecimals(),
  date: frenchDateToISO(),
});

export const placesEvolutionSchema = z.object({
  placesACreer: zSafeDecimals().optional(),
  placesAFermer: zSafeDecimals().optional(),
  echeancePlacesACreer: optionalFrenchDateToISO().optional(),
  echeancePlacesAFermer: optionalFrenchDateToISO().optional(),
});

export const structureTypologieSchema =
  structureTypologieWithoutEvolutionSchema.and(placesEvolutionSchema);

export const structureTypologiesSchema = z.object({
  structureTypologies: z.array(structureTypologieSchema),
});

export const structureTypologiesAutoSaveSchema = z.object({
  structureTypologies: z.array(
    structureTypologieWithoutEvolutionSchema
      .partial()
      .and(placesEvolutionSchema.partial())
  ),
});

export const structureTypologiesWithMandatoryEvolutionSchema =
  structureTypologiesSchema
    .refine(
      (data) => {
        return (
          !!data.structureTypologies[0]?.placesACreer ||
          data.structureTypologies[0]?.placesACreer === 0
        );
      },
      {
        message: "Le nombre de place à créer est obligatoire",
        path: ["structureTypologies", "0", "placesACreer"],
      }
    )
    .refine(
      (data) => {
        return (
          !!data.structureTypologies[0]?.placesAFermer ||
          data.structureTypologies[0]?.placesAFermer === 0
        );
      },
      {
        message: "Le nombre de place à fermer est obligatoire",
        path: ["structureTypologies", "0", "placesAFermer"],
      }
    )
    .refine(
      (data) => {
        return (
          data.structureTypologies[0]?.placesACreer === 0 ||
          !!data.structureTypologies[0]?.echeancePlacesACreer
        );
      },
      {
        message: "Ce champ est obligatoire s'il y a au moins une place à créer",
        path: ["structureTypologies", "0", "echeancePlacesACreer"],
      }
    )
    .refine(
      (data) => {
        return (
          data.structureTypologies[0]?.placesAFermer === 0 ||
          !!data.structureTypologies[0]?.echeancePlacesAFermer
        );
      },
      {
        message:
          "Ce champ est obligatoire s'il y a au moins une place à fermer",
        path: ["structureTypologies", "0", "echeancePlacesAFermer"],
      }
    );
