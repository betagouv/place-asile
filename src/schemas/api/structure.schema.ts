import { z } from "zod";

import { PublicType, StructureType } from "@/types/structure.type";

import { acteAdministratifApiSchema } from "./acteAdministratif.schema";
import { activiteApiSchema } from "./activite.schema";
import { adresseApiSchema } from "./adresse.schema";
import { budgetApiSchema } from "./budget.schema";
import { contactApiSchema } from "./contact.schema";
import { controleApiSchema } from "./controle.schema";
import { cpomMillesimeApiSchema } from "./cpom.schema";
import { documentFinancierApiSchema } from "./documentFinancier.schema";
import { evaluationApiSchema } from "./evaluation.schema";
import { evenementIndesirableGraveApiSchema } from "./evenement-indesirable-grave.schema";
import { formApiSchema } from "./form.schema";
import { operateurApiSchema } from "./operateur.schema";
import { structureMillesimeApiSchema } from "./structure-millesime.schema";
import { structureTypologieApiSchema } from "./structure-typologie.schema";

export const structureCreationApiSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  filiale: z.string().optional(),
  operateur: operateurApiSchema,
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
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  debutConvention: z.string().datetime().nullish(),
  finConvention: z.string().datetime().nullish(),
  cpom: z.boolean({
    message: "Le CPOM est requis",
  }),
  creationDate: z
    .string()
    .datetime({ message: "La date de création est requise" }),
  date303: z.string().datetime().nullish(),
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
  forms: z.array(formApiSchema).optional(),
  contacts: z.array(contactApiSchema),
  documentsFinanciers: z.array(documentFinancierApiSchema),
  nomOfii: z.string().optional(),
  directionTerritoriale: z.string().optional(),
  activeInOfiiFileSince: z.string().datetime().nullish(),
  inactiveInOfiiFileSince: z.string().datetime().nullish(),
});

const partialStructureCreationApiSchema = structureCreationApiSchema
  .partial()
  .extend({
    dnaCode: z.string().min(1, "Le code DNA est requis"),
    adresses: z.array(adresseApiSchema.partial()).optional(),
    forms: z.array(formApiSchema.partial()).optional(),
    contacts: z.array(contactApiSchema.partial()).optional(),
    documentsFinanciers: z
      .array(documentFinancierApiSchema.partial())
      .optional(),
    structureTypologies: z
      .array(structureTypologieApiSchema.partial())
      .optional(),
    structureMillesimes: z.array(structureMillesimeApiSchema).optional(),
  });

const remainingStructureUpdateApiSchema = z.object({
  id: z.number().optional(),
  placesACreer: z.number().int().min(0).nullish(),
  placesAFermer: z.number().int().min(0).nullish(),
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
  cpomMillesimes: z.array(cpomMillesimeApiSchema).optional(),
  forms: z.array(formApiSchema).optional(),
  actesAdministratifs: z.array(acteAdministratifApiSchema.partial()).optional(),
});

export const structureUpdateApiSchema = partialStructureCreationApiSchema.and(
  remainingStructureUpdateApiSchema
);

export const structureApiSchema = structureCreationApiSchema.and(
  remainingStructureUpdateApiSchema.extend({
    id: z.number(),
  })
);

export type StructureCreationApiType = z.infer<
  typeof structureCreationApiSchema
>;

export type StructureUpdateApiType = z.infer<typeof structureUpdateApiSchema>;

export type StructureApiType = z.infer<typeof structureApiSchema>;
