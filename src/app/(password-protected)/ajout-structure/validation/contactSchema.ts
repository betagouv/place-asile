import z from "zod";

export const contactSchema = z.object({
  prenom: z.string().nonempty(),
  nom: z.string().nonempty(),
  role: z.string().nonempty(),
  email: z.string().nonempty().email("L'email est invalide"),
  telephone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
});
