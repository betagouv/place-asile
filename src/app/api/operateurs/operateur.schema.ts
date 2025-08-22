import { z } from "zod";

const operateurSchema = z.object({
  name: z.string().min(1, "Le nom de l'opérateur est requis"),
});

export const operateurCreationSchema = z.array(operateurSchema);
