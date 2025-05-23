import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const contactSchema = z.object({
  prenom: z.string().nonempty(),
  nom: z.string().nonempty(),
  role: z.string().nonempty(),
  email: z.string().nonempty().email("L'email est invalide"),
  telephone: z.string().nonempty(),
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
      .string()
      .refine(
        (val) => dayjs(val, "DD/MM/YYYY", true).isValid(),
        "Format de date invalide (JJ/MM/AAAA)"
      )
  );

export type IdentificationFormValues = z.infer<typeof IdentificationSchema>;
export const IdentificationSchema = z.object({
  dnaCode: z.string().nonempty(),
  operateur: z.string().nonempty(),
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.nativeEnum(StructureType, {
      invalid_type_error: "Le type doit être un type de structure valide",
    })
  ),
  creationDate: createRequiredDateFieldValidator(),
  finessCode: z.string().optional().or(z.literal("")),
  public: z.nativeEnum(PublicType, {
    invalid_type_error:
      "Le public doit être de type : " + Object.values(PublicType).join(", "),
  }),
  filiale: z.string().optional(),
  cpom: z.boolean().optional(),
  lgbt: z.boolean(),
  fvvTeh: z.boolean(),
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
  adresseComplete: z.string().nonempty(),
  adresse: z.string().nonempty(),
  codePostal: z.string().nonempty(),
  commune: z.string().nonempty(),
  departement: z.string().nonempty(),
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
  adresseAdministrativeComplete: z.string().nonempty(),
  adresseAdministrative: z.string().nonempty(),
  codePostalAdministratif: z.string().nonempty(),
  communeAdministrative: z.string().nonempty(),
  departementAdministratif: z.string().nonempty(),
  typeBati: z.nativeEnum(Repartition),
  // Add adresses field to the base schema with optional array
  adresses: z.array(z.any()).optional(),
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
  pmr: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  lgbt: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
  fvvTeh: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
  ),
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
  key: z.string().optional(),
  date: createRequiredDateFieldValidator().optional(),
  category: z.string().optional(),
});

export type DocumentsSchemaFlexible = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsSchemaFlexible = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeFlexible),
});
