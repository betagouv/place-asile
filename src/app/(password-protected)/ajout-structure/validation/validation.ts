import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import "@/app/utils/zodErrorMap"; // Import the French error map
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Configure dayjs to use custom parse format
dayjs.extend(customParseFormat);

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "La fonction est requise"),
  email: z.string().email("L'email est invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
});

// Function to validate and parse dates in multiple formats
const parseDateString = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  // Try to parse as DD/MM/YYYY
  if (dayjs(dateString, "DD/MM/YYYY", true).isValid()) {
    return dateString; // Already in the correct format
  }

  // Try to parse as YYYY-MM-DD
  if (dayjs(dateString, "YYYY-MM-DD", true).isValid()) {
    // Convert to DD/MM/YYYY format
    return dayjs(dateString).format("DD/MM/YYYY");
  }

  // Invalid date format
  return undefined;
};

// Create a reusable date field preprocessor
const createDateFieldValidator = () =>
  z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseDateString(val) || val; // Return original value if parsing fails, to trigger validation error
      }
      return undefined;
    },
    z
      .string()
      .refine(
        (val) => dayjs(val, "DD/MM/YYYY", true).isValid(),
        "Format de date invalide (JJ/MM/AAAA)"
      )
      .optional()
  );

// Required date field validator
const createRequiredDateFieldValidator = () =>
  z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseDateString(val) || val;
      }
      return undefined;
    },
    z
      .string({
        required_error: "Ce champ est requis",
      })
      .refine(
        (val) => dayjs(val, "DD/MM/YYYY", true).isValid(),
        "Format de date invalide (JJ/MM/AAAA)"
      )
  );

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
  creationDate: createRequiredDateFieldValidator(),
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
  debutPeriodeAutorisation: createDateFieldValidator(),
  finPeriodeAutorisation: createDateFieldValidator(),
  debutConvention: createDateFieldValidator(),
  finConvention: createDateFieldValidator(),
  debutCpom: createDateFieldValidator(),
  finCpom: createDateFieldValidator(),
});

const singleAdresseSchema = z.object({
  adresse: z.string(),
  codePostal: z.string(),
  commune: z.string(),
  repartition: z.nativeEnum(Repartition),
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
  adresses: z.array(singleAdresseSchema).optional(),
});
