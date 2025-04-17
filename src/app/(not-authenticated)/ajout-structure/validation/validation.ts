import { z } from "zod";

export const step1Schema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
});

export const step2Schema = z.object({
  company: z.string().min(1, "Entreprise requise"),
  years: z.coerce.number().min(0, "Années requises"),
});

export const fullSchema = z.object({
  personalInfo: step1Schema,
  experience: step2Schema,
});

export type FullForm = z.infer<typeof fullSchema>;
