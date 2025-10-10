import { z } from "zod";

import { typologieItemBaseSchema } from "../base/typePlaces.schema";

export const ajoutTypePlacesSchema = z.object({
  typologies: z.array(typologieItemBaseSchema),
});

export type AjoutTypePlacesFormValues = z.infer<typeof ajoutTypePlacesSchema>;
