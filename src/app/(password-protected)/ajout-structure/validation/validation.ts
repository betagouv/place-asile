import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import "@/app/utils/zodErrorMap"; // Import the French error map

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "La fonction est requise"),
  email: z.string().email("L'email est invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
});

// Regex pattern for DD/MM/YYYY date format
const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const dateValidation = z
  .string()
  .regex(datePattern, "Format de date invalide (JJ/MM/AAAA)");

export const IdentificationSchema = z.object({
  dnaCode: z.string().min(1, "Code DNA requis"),
  operateur: z.string().min(1, "L'opérateur est requis"),
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.nativeEnum(StructureType, {
      required_error: "Le type est requis",
      invalid_type_error: "Le type doit être un type de structure valide",
    })
  ),
  creationDate: dateValidation,
  finessCode: z.string().optional().or(z.literal("")),
  public: z.nativeEnum(PublicType, {
    required_error: "Le public est requis",
    invalid_type_error:
      "Le public doit être de type : " + Object.values(PublicType).join(", "),
  }),
  filiale: z.string().optional(),
  cpom: z.boolean().optional(),
  lgbt: z.boolean().optional(),
  fvvTeh: z.boolean().optional(),
  contactPrincipal: contactSchema,
  contactSecondaire: contactSchema.partial(),
  debutPeriodeAutorisation: dateValidation.optional(),
  finPeriodeAutorisation: dateValidation.optional(),
  debutConvention: dateValidation.optional(),
  finConvention: dateValidation.optional(),
  debutCpom: dateValidation.optional(),
  finCpom: dateValidation.optional(),
});

const singleAdresseSchema = z.object({
  adresse: z.string(),
  codePostal: z.string(),
  commune: z.string(),
  repartition: z.nativeEnum(Repartition),
  // TODO @Alezco : Je ne vois pas de notion de places dans le type Adresse, doit-on le gérer dans le dev ou est-ce un erreur de maquettes ?
  places: z.number(),
  typologies: z.array(z.any()).optional(),
});

export const AdressesSchema = z.object({
  nom: z.string().optional(),
  adresseAdministrative: z.string(),
  codePostalAdministratif: z.string(),
  communeAdministrative: z.string(),
  departementAdministratif: z.string(),
  typeBatis: z.nativeEnum(Repartition, {
    required_error: "Le type de batis est requis",
    invalid_type_error:
      "Le type de batis doit être de type : " +
      Object.values(Repartition).join(", "),
  }),
  // add a repeatable field for sub-adresses corresponding to the Adresse type file
  adresses: z.array(singleAdresseSchema).optional(),
});
