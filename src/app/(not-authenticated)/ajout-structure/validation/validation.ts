import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "La fonction est requise"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
});

export const InformationsSchema = z.object({
  dnaCode: z.string().min(1, "Code DNA requis"),
  operateur: z.string().min(1, "L'opérateur est requis"),
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.nativeEnum(StructureType, {
      required_error: "Le type est requis",
      invalid_type_error: "Le type doit être un type de structure valide",
    })
  ),
  creationDate: z.date(),
  finessCode: z.string(),
  public: z.nativeEnum(PublicType),
  filiale: z.string(),
  cpom: z.boolean(),
  lgbt: z.boolean(),
  fvvTeh: z.boolean(),
  contactPrincipal: contactSchema,
  contactSecondaire: contactSchema.partial(),
  debutPeriodeAutorisation: z.date(),
  finPeriodeAutorisation: z.date(),
  debutConvention: z.date(),
  finConvention: z.date(),
  debutCpom: z.date(),
  finCpom: z.date(),
});

// export const step2Schema = z.object({
//   company: z.string().min(1, "Entreprise requise"),
//   years: z.coerce.number().min(0, "Années requises"),
// });

// export const fullSchema = z.object({
//   personalInfo: step1Schema,
//   experience: step2Schema,
// });

// export type FullForm = z.infer<typeof fullSchema>;
