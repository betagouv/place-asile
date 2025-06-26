import z from "zod";

const baseContactSchema = z.object({
  prenom: z.string(),
  nom: z.string(),
  role: z.string(),
  email: z.string().email("Veuillez saisir une adresse email valide"),
  telephone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
});

export const requiredContactSchema = z.object({
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
});

const optionalContactSchema = baseContactSchema
  .partial()
  .superRefine((data, ctx) => {
    if (!data) return;

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

    if (filledFields.length === 0) return;

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

export type RequiredContactFormValues = z.infer<typeof requiredContactSchema>;
export type OptionalContactFormValues = z.infer<typeof optionalContactSchema>;
