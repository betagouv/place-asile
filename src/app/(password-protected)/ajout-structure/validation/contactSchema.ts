import z from "zod";

// Define the base contact schema for required fields
const baseContactSchema = z.object({
  prenom: z.string(),
  nom: z.string(),
  role: z.string(),
  email: z.string(),
  telephone: z.string(),
});

// Define the required contact schema with all validations
export const requiredContactSchema = z.object({
  prenom: z.string().nonempty("Le prénom est requis"),
  nom: z.string().nonempty("Le nom est requis"),
  role: z.string().nonempty("Le rôle est requis"),
  email: z
    .string()
    .nonempty("L'email est requis")
    .email("L'email est invalide"),
  telephone: z
    .string()
    .nonempty("Le téléphone est requis")
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
});

// Create the optional contact schema with all-or-nothing validation
const optionalContactSchema = baseContactSchema
  .partial()
  .superRefine((data, ctx) => {
    if (!data) return;

    const { prenom, nom, role, email, telephone } = data;

    const fields = [
      { name: "prenom", value: prenom, message: "Le prénom est requis" },
      { name: "nom", value: nom, message: "Le nom est requis" },
      { name: "role", value: role, message: "Le rôle est requis" },
      { name: "email", value: email, message: "L'email est requis" },
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
    } else if (filledFields.length === fields.length) {
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "L'email est invalide",
          path: ["email"],
        });
      }

      if (telephone && telephone.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le numéro de téléphone doit contenir au moins 10 caractères",
          path: ["telephone"],
        });
      }
    }
  });

export const contactSchema = Object.assign(requiredContactSchema, {
  optional: () => optionalContactSchema,
});
