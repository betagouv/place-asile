import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  role: z.string().min(1, "La fonction est requise"),
  email: z.string().email("L'email est invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
});

const parseDateString = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  if (dayjs(dateString, "DD/MM/YYYY", true).isValid()) {
    return dateString;
  }

  if (dayjs(dateString, "YYYY-MM-DD", true).isValid()) {
    return dayjs(dateString).format("DD/MM/YYYY");
  }

  return undefined;
};

const createDateFieldValidator = () =>
  z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseDateString(val) || val;
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
  adresseComplete: z.string().nonempty("L'adresse est obligatoire"),
  adresse: z.string().nonempty("La rue est obligatoire"),
  codePostal: z.string().nonempty("Le code postal est obligatoire"),
  commune: z.string().nonempty("La commune est obligatoire"),
  departement: z.string().nonempty("Le département est obligatoire"),
  repartition: z.nativeEnum(Repartition),
  places: z.number(),
  typologies: z.array(z.any()).optional(),
});

const extendedAdresseSchema = singleAdresseSchema.extend({
  places: z.any(),
  repartition: z.nativeEnum(Repartition),
  typologies: z.array(z.enum(["logementSocial", "qpv"])),
});

export const AdressesSchema = z.object({
  nom: z.string().optional(),
  adresseAdministrative: z.string(),
  codePostalAdministratif: z.string(),
  communeAdministrative: z.string(),
  departementAdministratif: z.string(),
  typeBati: z.nativeEnum(Repartition, {
    required_error: "Le type de batis est requis",
    invalid_type_error:
      "Le type de batis doit être de type : " +
      Object.values(Repartition).join(", "),
  }),
  adresses: z.array(extendedAdresseSchema).optional(),
});

export const PlacesSchema = z.object({
  autorisees: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  pmr: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    )
    .optional(),
  lgbt: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    )
    .optional(),
  fvvTeh: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    )
    .optional(),
});

export const TypePlacesSchema = z.object({
  "2023": PlacesSchema,
  "2024": PlacesSchema,
  "2025": PlacesSchema,
});
