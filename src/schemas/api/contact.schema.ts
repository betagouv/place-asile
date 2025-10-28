import z from "zod";

import { ContactType } from "@/types/contact.type";

export const contactApiSchema = z.object({
  id: z.number().optional(),
  structureDnaCode: z.string().optional(),
  prenom: z.string().min(1, "Le prénom du contact est requis"),
  nom: z.string().min(1, "Le nom du contact est requis"),
  telephone: z.string().min(1, "Le numéro de téléphone du contact est requis"),
  email: z.string().email().min(1, "L'email du contact est requis"),
  role: z.string().min(1, "Le rôle du contact est requis"),
  type: z.nativeEnum(ContactType).optional(),
});

export type ContactApiType = z.infer<typeof contactApiSchema>;
