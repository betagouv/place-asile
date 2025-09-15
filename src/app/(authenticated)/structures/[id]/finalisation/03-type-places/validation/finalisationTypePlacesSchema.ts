import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

export type TypePlacesFormValues = z.infer<typeof finalisationTypePlacesSchema>;
export const finalisationTypePlacesSchema = z
  .object({
    typologies: z.array(
      z.object({
        id: z.number(),
        placesAutorisees: z.union([
          z
            .string()
            .min(1, {
                error: "Nombre de places requis"
            })
            .transform(Number),
          z.number().min(0, {
              error: "Nombre de places requis"
        }),
        ]),
        pmr: z.union([
          z
            .string()
            .min(1, {
                error: "Nombre de places PMR requis"
            })
            .transform(Number),
          z.number().min(0, {
              error: "Nombre de places PMR requis"
        }),
        ]),
        lgbt: z.union([
          z
            .string()
            .min(1, {
                error: "Nombre de places LGBT requis"
            })
            .transform(Number),
          z.number().min(0, {
              error: "Nombre de places LGBT requis"
        }),
        ]),
        fvvTeh: z.union([
          z
            .string()
            .min(1, {
                error: "Nombre de places FVV/TEH requis"
            })
            .transform(Number),
          z.number().min(0, {
              error: "Nombre de places FVV/TEH requis"
        }),
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
      path: ["echeancePlacesACreer"],
        error: "Ce champ est obligatoire s'il y a au moins une place à créer"
    }
  )
  .refine(
    (data) => {
      return data.placesAFermer <= 0 || !!data.echeancePlacesAFermer;
    },
    {
      path: ["echeancePlacesAFermer"],
        error: "Ce champ est obligatoire s'il y a au moins une place à fermer"
    }
  );
