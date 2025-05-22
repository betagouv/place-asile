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
        console.log(">>>>>>>>>>", parseDateString(val) || val);
        console.log("==========", dayjs(val, "DD/MM/YYYY", true));
        console.log("----------", dayjs(val, "DD/MM/YYYY", true).isValid());
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

export type IdentificationFormValues = z.infer<typeof IdentificationSchema>;
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
  filiale: z.string().optional(), // TODO: handle filiales
  cpom: z.boolean().optional(), // TODO: remove optionals
  lgbt: z.boolean().optional(),
  fvvTeh: z.boolean().optional(),
  contactPrincipal: contactSchema,
  contactSecondaire: contactSchema.partial(),
  debutPeriodeAutorisation: createDateFieldValidator(),
  finPeriodeAutorisation: createDateFieldValidator(),
  debutConvention: createDateFieldValidator().optional(),
  finConvention: createDateFieldValidator().optional(),
  debutCpom: createDateFieldValidator(),
  finCpom: createDateFieldValidator(),
});

const singleAdresseSchemaStrict = z.object({
  adresseComplete: z.string().nonempty("L'adresse est obligatoire"),
  adresse: z.string().nonempty("La rue est obligatoire"),
  codePostal: z.string().nonempty("Le code postal est obligatoire"),
  commune: z.string().nonempty("La commune est obligatoire"),
  departement: z.string().nonempty("Le département est obligatoire"),
  repartition: z.nativeEnum(Repartition),
  places: z.number(),
  typologies: z.array(z.any()).optional(),
});

const singleAdresseSchemaFlexible = z.object({
  adresseComplete: z.string().optional(),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  commune: z.string().optional(),
  departement: z.string().optional(),
  repartition: z.nativeEnum(Repartition).optional(),
  places: z.number().optional(),
  typologies: z.array(z.any()).optional(),
});

const extendedAdresseSchemaFlexible = singleAdresseSchemaFlexible.extend({
  places: z.any(),
  repartition: z.nativeEnum(Repartition),
  qpv: z.boolean().optional(),
  logementSocial: z.boolean().optional(),
});

const extendedAdresseSchemaStrict = singleAdresseSchemaStrict.extend({
  places: z.any(),
  repartition: z.nativeEnum(Repartition),
  qpv: z.boolean().optional(),
  logementSocial: z.boolean().optional(),
});

export type AdressesFormValues = z.infer<typeof AdressesSchema>;
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
});

export const AdressesSchemaStrict = AdressesSchema.extend({
  adresses: z.array(extendedAdresseSchemaStrict),
});

export const AdressesSchemaFlexible = AdressesSchema.extend({
  adresses: z.array(extendedAdresseSchemaFlexible),
});

export type AdressesFormValuesStrict = z.infer<typeof AdressesSchemaStrict>;
export type AdressesFormValuesFlexible = z.infer<typeof AdressesSchemaFlexible>;

export type PlacesFormValues = z.infer<typeof PlacesSchema>;
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
  date: createRequiredDateFieldValidator(),
});

export type TypePlacesFormValues = z.infer<typeof TypePlacesSchema>;
export const TypePlacesSchema = z.object({
  typologies: z.array(PlacesSchema),
});

export type DocumentsTypeStrict = z.infer<typeof DocumentsSchemaStrict>;
export const DocumentsTypeStrict = z.object({
  key: z.string(),
  date: createRequiredDateFieldValidator(),
  category: z.string(),
});

export type DocumentsSchemaStrict = z.infer<typeof DocumentsSchemaStrict>;
export const DocumentsSchemaStrict = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeStrict),
});

export type DocumentsTypeFlexible = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsTypeFlexible = z.object({
  key: z.string(),
  date: createRequiredDateFieldValidator(),
  category: z.string(),
});

export type DocumentsSchemaFlexible = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsSchemaFlexible = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeFlexible),
});
