import { z } from "zod";

export const identificationSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
});
