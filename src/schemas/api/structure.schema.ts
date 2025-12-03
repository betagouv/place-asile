import { z } from "zod";

import { PublicType, StructureType } from "@/types/structure.type";

import { acteAdministratifApiSchema } from "./acteAdministratif.schema";
import { activiteApiSchema } from "./activite.schema";
import { adresseApiSchema } from "./adresse.schema";
import { budgetApiSchema } from "./budget.schema";
import { contactApiSchema } from "./contact.schema";
import { controleApiSchema } from "./controle.schema";
import { cpomMillesimeApiSchema, cpomStructureApiSchema } from "./cpom.schema";
import { documentFinancierApiSchema } from "./documentFinancier.schema";
import { evaluationApiSchema } from "./evaluation.schema";
import { evenementIndesirableGraveApiSchema } from "./evenement-indesirable-grave.schema";
import { formApiSchema } from "./form.schema";
import { operateurApiSchema } from "./operateur.schema";
import { structureMillesimeApiSchema } from "./structure-millesime.schema";
import { structureTypologieApiSchema } from "./structure-typologie.schema";

/**
 * Schéma de base avec uniquement les champs scalaires de la structure
 * (pas les relations comme contacts, budgets, etc.)
 */
export const structureScalarFieldsSchema = z.object({
  dnaCode: z.string(),
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType).optional(),
  placesACreer: z.number().int().min(0).nullish(),
  placesAFermer: z.number().int().min(0).nullish(),
  echeancePlacesACreer: z.string().datetime().nullish(),
  echeancePlacesAFermer: z.string().datetime().nullish(),
  adresseAdministrative: z.string().optional(),
  codePostalAdministratif: z.string().optional(),
  communeAdministrative: z.string().optional(),
  departementAdministratif: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  nom: z.string().optional(),
  date303: z.string().datetime().nullish(),
  debutConvention: z.string().datetime().nullish(),
  finConvention: z.string().datetime().nullish(),
  creationDate: z.string().datetime().nullish(),
  finessCode: z.string().optional(),
  lgbt: z.boolean().optional(),
  fvvTeh: z.boolean().optional(),
  public: z.nativeEnum(PublicType).optional(),
  debutPeriodeAutorisation: z.string().datetime().nullish(),
  finPeriodeAutorisation: z.string().datetime().nullish(),
  notes: z.string().nullish(),
  nomOfii: z.string().optional(),
  directionTerritoriale: z.string().optional(),
  activeInOfiiFileSince: z.string().datetime().nullish(),
  inactiveInOfiiFileSince: z.string().datetime().nullish(),
  operateur: operateurApiSchema.optional(),
});

/**
 * Schéma minimal : champs scalaires requis pour une structure minimale
 */
export const structureMinimalApiSchema = structureScalarFieldsSchema.extend({
  operateur: operateurApiSchema,
  type: z.nativeEnum(StructureType),
  structureMillesimes: z.array(structureMillesimeApiSchema),
  cpomMillesimes: z.array(cpomMillesimeApiSchema).optional(),
  cpomStructures: z.array(cpomStructureApiSchema).optional(),
  departementAdministratif: z
    .string()
    .min(1, "Le département de l'adresse administrative est requis"),
});

/**
 * Schéma pour la création : champs scalaires requis + relations requises
 */
export const structureCreationApiSchema = structureScalarFieldsSchema.extend({
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
  creationDate: z
    .string()
    .datetime({ message: "La date de création est requise" }),
  lgbt: z.boolean({
    message: "L'accueil de LGBT dans la structure est requis",
  }),
  fvvTeh: z.boolean({
    message: "L'accueil de FVV-TEH dans la structure est requis",
  }),
  public: z.nativeEnum(PublicType),
  operateur: operateurApiSchema,
  adresses: z.array(adresseApiSchema),
  structureTypologies: z.array(structureTypologieApiSchema),
  contacts: z.array(contactApiSchema),
  documentsFinanciers: z.array(documentFinancierApiSchema),
  budgets: z.array(budgetApiSchema).optional(),
  cpomMillesimes: z.array(cpomMillesimeApiSchema).optional(),
  structureMillesimes: z.array(structureMillesimeApiSchema).optional(),
  cpomStructures: z.array(cpomStructureApiSchema).optional(),
  actesAdministratifs: z.array(acteAdministratifApiSchema.partial()).optional(),
  controles: z.array(controleApiSchema).optional(),
  evaluations: z.array(evaluationApiSchema).optional(),
  evenementsIndesirablesGraves: z
    .array(evenementIndesirableGraveApiSchema)
    .optional(),
  activites: z.array(activiteApiSchema).optional(),
  forms: z.array(formApiSchema).optional(),
});

export const structureUpdateApiSchema = structureScalarFieldsSchema
  .partial()
  .extend({
    dnaCode: z.string().min(1, "Le code DNA est requis"),
    id: z.number().optional(),
    contacts: z.array(contactApiSchema.partial()).optional(),
    budgets: z.array(budgetApiSchema).optional(),
    cpomMillesimes: z.array(cpomMillesimeApiSchema).optional(),
    structureTypologies: z
      .array(structureTypologieApiSchema.partial())
      .optional(),
    adresses: z.array(adresseApiSchema.partial()).optional(),
    actesAdministratifs: z
      .array(acteAdministratifApiSchema.partial())
      .optional(),
    documentsFinanciers: z
      .array(documentFinancierApiSchema.partial())
      .optional(),
    controles: z.array(controleApiSchema).optional(),
    evaluations: z.array(evaluationApiSchema).optional(),
    evenementsIndesirablesGraves: z
      .array(evenementIndesirableGraveApiSchema)
      .optional(),
    activites: z.array(activiteApiSchema).optional(),
    forms: z.array(formApiSchema).optional(),
    structureMillesimes: z.array(structureMillesimeApiSchema).optional(),
    cpomStructures: z.array(cpomStructureApiSchema).optional(),
  });

export const structureApiSchema = structureCreationApiSchema.extend({
  id: z.number(),
});

export type StructureMinimalApiType = z.infer<typeof structureMinimalApiSchema>;

export type StructureCreationApiType = z.infer<
  typeof structureCreationApiSchema
>;

export type StructureScalarFieldsType = z.infer<
  typeof structureScalarFieldsSchema
>;

export type StructureUpdateApiType = z.infer<typeof structureUpdateApiSchema>;

export type StructureApiType = z.infer<typeof structureApiSchema>;
