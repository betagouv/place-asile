import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import z from "zod";

export type TypePlacesFormValues = z.infer<typeof finalisationTypePlacesSchema>;
export const finalisationTypePlacesSchema = z
  .object({
    typologies: z.array(
      z.object({
        id: z.number(),
        placesAutorisees: z.union([
          z
            .string()
            // TODO : temporaire, ligne à décommenter
            // .min(1, { message: "Nombre de places requis" })
            .transform(Number),
          z.number().min(0, { message: "Nombre de places requis" }),
        ]),
        pmr: z.union([
          z
            .string()
            .min(1, { message: "Nombre de places PMR requis" })
            .transform(Number),
          z.number().min(0, { message: "Nombre de places PMR requis" }),
        ]),
        lgbt: z.union([
          z
            .string()
            .min(1, { message: "Nombre de places LGBT requis" })
            .transform(Number),
          z.number().min(0, { message: "Nombre de places LGBT requis" }),
        ]),
        fvvTeh: z.union([
          z
            .string()
            .min(1, { message: "Nombre de places FVV/TEH requis" })
            .transform(Number),
          z.number().min(0, { message: "Nombre de places FVV/TEH requis" }),
        ]),
      })
    ),
    placesACreer: zSafeNumber(),
    placesAFermer: zSafeNumber(),
    echeancePlacesACreer: createDateFieldValidator().optional(),
    echeancePlacesAFermer: createDateFieldValidator().optional(),
  })
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
