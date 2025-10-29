import z from "zod";

import { ContactType } from "@/types/contact.type";

export const requiredContactSchema = z.object({
  id: z.number().optional(),
  prenom: z.string().nonempty("Le prénom est requis"),
  nom: z.string().nonempty("Le nom est requis"),
  role: z.string().nonempty("Le rôle est requis"),
  email: z
    .string()
    .nonempty("Veuillez saisir une adresse email valide")
    .email("Veuillez saisir une adresse email valide"),
  telephone: z
    .string()
    .nonempty("Le téléphone est requis")
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  type: z.nativeEnum(ContactType),
});

export const optionalContactSchema = z
  .object({
    id: z.number().optional(),
    prenom: z.string().optional(),
    nom: z.string().optional(),
    role: z.string().optional(),
    email: z.string().optional(),
    telephone: z.string().optional(),
    type: z.nativeEnum(ContactType).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data) {
      return;
    }

    const { prenom, nom, role, email, telephone } = data;

    const fields = [
      { name: "prenom", value: prenom, message: "Le prénom est requis" },
      { name: "nom", value: nom, message: "Le nom est requis" },
      { name: "role", value: role, message: "Le rôle est requis" },
      {
        name: "email",
        value: email,
        message: "Veuillez saisir une adresse email valide",
      },
      {
        name: "telephone",
        value: telephone,
        message: "Le téléphone est requis",
      },
    ];

    const filledFields = fields.filter(
      (field) => field.value !== undefined && field.value !== ""
    );
    console.log("filledFields", filledFields);
    if (filledFields.length === 0) {
      return;
    }

    if (filledFields.length > 0 && filledFields.length < fields.length) {
      fields.forEach((field) => {
        if (!field.value || field.value === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: field.message,
            path: [field.name],
          });
        }
      });
    }
  });

export const contactSchema = Object.assign(requiredContactSchema, {
  optional: () => optionalContactSchema,
});
