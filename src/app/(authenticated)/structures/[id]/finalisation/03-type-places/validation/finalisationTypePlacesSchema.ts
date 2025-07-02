import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import z from "zod";

export type TypePlacesFormValues = z.infer<typeof finalisationTypePlacesSchema>;
export const finalisationTypePlacesSchema = z.object({
  typologies: z.array(
    z.object({
      nbPlaces: z.union([
        z
          .string()
          .min(1, { message: "Nombre de places requis" })
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
  placesACreer: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  placesAFermer: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  echeancePlacesACreer: createDateFieldValidator().optional(),
  echeancePlacesAFermer: createDateFieldValidator().optional(),
});
