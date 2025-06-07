import { z } from "zod";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FileUploadCategory } from "@/types/file-upload.type";
import { isStructureSubventionnee } from "@/app/utils/structure.util";

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

// TODO : move this function to a utils file
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

// TODO : move this function to a reusable zod validator file
const createDateFieldValidator = () => {
  return z.preprocess(
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
      .refine((val) => !!val, "Ce champ est obligatoire")
  );
};

export type IdentificationFormValues = z.infer<typeof IdentificationSchema>;
export const IdentificationSchema = z
  .object({
    dnaCode: z.string().nonempty(),
    operateur: z.string().nonempty(),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(StructureType, {
        invalid_type_error: "Le type doit être un type de structure valide",
      })
    ),
    creationDate: createDateFieldValidator(),
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
    debutCpom: createDateFieldValidator().optional(),
    finCpom: createDateFieldValidator().optional(),
  })
  .refine(
    (data) => {
      // If cpom is true, debutCpom is required
      if (data.cpom && !data.debutCpom) {
        return false;
      }
      return true;
    },
    {
      message: "La date de début CPOM est obligatoire",
      path: ["debutCpom"],
    }
  )
  .refine(
    (data) => {
      // If cpom is true, finCpom is required
      if (data.cpom && !data.finCpom) {
        return false;
      }
      return true;
    },
    {
      message: "La date de fin CPOM est obligatoire",
      path: ["finCpom"],
    }
  )
  .refine(
    (data) => {
      // If structure type is subventionnée, finessCode is required
      if (
        isStructureSubventionnee(data.type) &&
        (!data.finessCode || data.finessCode === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Le code FINESS est obligatoire pour les structures subventionnées",
      path: ["finessCode"],
    }
  );

const singleAdresseSchema = z.object({
  adresseComplete: z.string().nonempty(),
  adresse: z.string().nonempty(),
  codePostal: z.string().nonempty(),
  commune: z.string().nonempty(),
  repartition: z.nativeEnum(Repartition),
  places: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0)
    )
    .optional(),
  typologies: z.array(z.any()).optional(),
});

const extendedAdresseSchema = singleAdresseSchema.extend({
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
  typeBati: z.nativeEnum(Repartition),
  sameAddress: z.boolean().optional(),
  adresses: z.array(
    extendedAdresseSchema.superRefine((adresse, ctx) => {
      // Check if this address has a non-empty adresseComplete but empty places
      if (
        adresse.adresseComplete &&
        adresse.adresseComplete.trim() !== "" &&
        (adresse.places === undefined || adresse.places === null)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Requis",
          path: ["places"],
        });
      }
    })
  ),
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
  date: createDateFieldValidator(),
});

export type TypePlacesFormValues = z.infer<typeof TypePlacesSchema>;
export const TypePlacesSchema = z.object({
  typologies: z.array(PlacesSchema),
});

export type DocumentsTypeStrict = z.infer<typeof DocumentsSchemaStrict>;
export const DocumentsTypeStrict = z.object({
  key: z.string(),
  date: createDateFieldValidator(),
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
  date: createDateFieldValidator().optional(),
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
    date: createDateFieldValidator().optional(),
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
