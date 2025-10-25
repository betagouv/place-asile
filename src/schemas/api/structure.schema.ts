import { z } from "zod";

import { PublicType, StructureType } from "@/types/structure.type";

import { activiteApiSchema } from "./activite.schema";
import { adresseApiSchema } from "./adresse.schema";
import { budgetApiSchema } from "./budget.schema";
import { contactApiSchema } from "./contact.schema";
import { controleApiSchema } from "./controle.schema";
import { evaluationApiSchema } from "./evaluation.schema";
import { evenementIndesirableGraveApiSchema } from "./evenement-indesirable-grave.schema";
import { fileUploadApiSchema } from "./fileUpload.schema";
import { formApiSchema } from "./form.schema";
import { operateurApiSchema } from "./operateur.schema";
import { structureTypologieApiSchema } from "./structure-typologie.schema";

const structureBaseApiSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  filiale: z.string().optional(),
  operateur: operateurApiSchema.optional(),
  type: z.nativeEnum(StructureType),
  nom: z.string().optional(),
  adresseAdministrative: z
    .string()
    .min(1, "L'adresse administrative est requise"),
  codePostalAdministratif: z
    .string()
    .min(1, "Le code postal administratif est requis"),
  communeAdministrative: z
    .string()
    .min(1, "La commune de l'adresse administrative est requise"),
  departementAdministratif: z
    .string()
    .min(1, "Le département de l'adresse administrative est requis"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  debutConvention: z.string().datetime().nullish(),
  finConvention: z.string().datetime().nullish(),
  cpom: z.boolean({
    message: "Le CPOM est requis",
  }),
  creationDate: z
    .string()
    .datetime({ message: "La date de création est requise" }),
  finessCode: z.string().optional(),
  lgbt: z.boolean({
    message: "L'accueil de LGBT dans la structure est requis",
  }),
  fvvTeh: z.boolean({
    message: "L'accueil de FVV-TEH dans la structure est requis",
  }),
  public: z.nativeEnum(PublicType),
  debutPeriodeAutorisation: z.string().datetime().nullish(),
  finPeriodeAutorisation: z.string().datetime().nullish(),
  debutCpom: z.string().datetime().nullish(),
  finCpom: z.string().datetime().nullish(),
  adresses: z.array(adresseApiSchema),
  structureTypologies: z.array(structureTypologieApiSchema),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const structureSimpleApiSchema = structureBaseApiSchema.extend({
  id: z.number(),
  forms: z.array(formApiSchema.partial()).optional(),
});

export const structureCreationApiSchema = structureBaseApiSchema.extend({
  operateur: operateurApiSchema,
  contacts: z.array(contactApiSchema),
  fileUploads: z.array(fileUploadApiSchema),
});

const partialStructureCreationApiSchema = structureCreationApiSchema
  .partial()
  .extend({
    dnaCode: z.string().min(1, "Le code DNA est requis"),
    adresses: z.array(adresseApiSchema.partial()).optional(),
    contacts: z.array(contactApiSchema.partial()).optional(),
    fileUploads: z.array(fileUploadApiSchema.partial()).optional(),
    structureTypologies: z
      .array(structureTypologieApiSchema.partial())
      .optional(),
  });

const remainingStructureUpdateApiSchema = z.object({
  id: z.number().optional(),
  placesACreer: z.number().int().nullish(),
  placesAFermer: z.number().int().nullish(),
  echeancePlacesACreer: z.string().datetime().nullish(),
  echeancePlacesAFermer: z.string().datetime().nullish(),
  notes: z.string().nullish(),
  controles: z.array(controleApiSchema).optional(),
  evaluations: z.array(evaluationApiSchema).optional(),
  evenementsIndesirablesGraves: z
    .array(evenementIndesirableGraveApiSchema)
    .optional(),
  activites: z.array(activiteApiSchema).optional(),
  budgets: z.array(budgetApiSchema).optional(),
  forms: z.array(formApiSchema).optional(),
});

export const structureUpdateApiSchema = partialStructureCreationApiSchema.and(
  remainingStructureUpdateApiSchema
);

export const structureApiSchema = structureCreationApiSchema.and(
  remainingStructureUpdateApiSchema.extend({
    id: z.number(),
  })
);

export type StructureSimpleApiType = z.infer<typeof structureSimpleApiSchema>;

export type StructureCreationApiType = z.infer<
  typeof structureCreationApiSchema
>;

export type StructureUpdateApiType = z.infer<typeof structureUpdateApiSchema>;

export type StructureApiType = z.infer<typeof structureApiSchema>;
