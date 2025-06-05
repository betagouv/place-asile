import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FileUploadCategory } from "@/types/file-upload.type";

dayjs.extend(customParseFormat);

const contactSchema = z.object({
  prenom: z.string().nonempty(),
  nom: z.string().nonempty(),
  role: z.string().nonempty(),
  email: z.string().nonempty().email("L'email est invalide"),
  telephone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
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
  cpom: z.boolean(),
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

const singleAdresseSchema = z.object({
  adresseComplete: z.string().nonempty(),
  adresse: z.string().nonempty(),
  codePostal: z.string().nonempty(),
  commune: z.string().nonempty(),
  repartition: z.nativeEnum(Repartition),
  places: z.number(),
  typologies: z.array(z.any()).optional(),
});

const extendedAdresseSchema = singleAdresseSchema.extend({
  places: z.any(),
  repartition: z.nativeEnum(Repartition),
  qpv: z.boolean().optional(),
  logementSocial: z.boolean().optional(),
});

export type AdressesFormValues = z.infer<typeof AdressesSchema>;
export const AdressesSchema = z.object({
  nom: z.string().optional(),
  adresseAdministrativeComplete: z.string().min(3),
  adresseAdministrative: z.string().nonempty(),
  codePostalAdministratif: z.string().nonempty(),
  communeAdministrative: z.string().nonempty(),
  departementAdministratif: z.string().nonempty(),
  typeBati: z.nativeEnum(Repartition).optional(),
  sameAddress: z.boolean().optional(),
  adresses: z.array(extendedAdresseSchema).optional(),
});

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
  category: z.nativeEnum(FileUploadCategory, {
    invalid_type_error:
      "La catégorie du document doit être de type : " +
      Object.values(PublicType).join(", "),
  }),
});

export type DocumentsSchemaStrict = z.infer<typeof DocumentsSchemaStrict>;

export type DocumentsTypeFlexible = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsTypeFlexible = z.object({
  key: z.string().optional(),
  date: createRequiredDateFieldValidator().optional(),
  category: z
    .nativeEnum(FileUploadCategory, {
      invalid_type_error:
        "La catégorie du document doit être de type : " +
        Object.values(PublicType).join(", "),
    })
    .optional(),
});

export type DocumentsSchemaFlexible = z.infer<typeof DocumentsSchemaFlexible>;
export const DocumentsSchemaFlexible = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeFlexible),
});

export const DocumentsTypeConditional = z
  .object({
    key: z.string().optional(),
    date: createRequiredDateFieldValidator().optional(),
    category: z
      .nativeEnum(FileUploadCategory, {
        invalid_type_error:
          "La catégorie du document doit être de type : " +
          Object.values(PublicType).join(", "),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.category !== FileUploadCategory.BUDGET_RECTIFICATIF &&
      data.category !== FileUploadCategory.RAPPORT_BUDGETAIRE
    ) {
      if (!data.key) {
        ctx.addIssue({
          path: ["key"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
      if (!data.category) {
        ctx.addIssue({
          path: ["category"],
          code: z.ZodIssueCode.custom,
          message: "Ce champ est requis",
        });
      }
    }
  });

export const DocumentsSchemaStrict = z.object({
  less5Years: z.boolean(),
  fileUploads: z.array(DocumentsTypeConditional),
});
