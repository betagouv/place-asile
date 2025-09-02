import { z } from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";

export type PlacesFormValues = z.infer<typeof PlacesSchema>;
export const PlacesSchema = z.object({
  placesAutorisees: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  pmr: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  lgbt: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  fvvTeh: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  date: createDateFieldValidator(),
});

export const TypePlacesSchema = z.object({
  typologies: z.array(PlacesSchema),
});

export type TypePlacesFormValues = z.infer<typeof TypePlacesSchema>;
