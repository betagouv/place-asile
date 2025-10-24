import { z } from "zod";

import { createNullableDateValidator } from "@/app/utils/zodCustomFields";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

import { frDateField } from "../../app/api/structures/structure.util";
import { adresseApiSchema } from "./adresse.schema";
import { budgetApiSchema } from "./budget.schema";
import { contactApiSchema } from "./contact.schema";
import { controleApiSchema } from "./controle.schema";
import { fileUploadApiSchema } from "./fileUpload.schema";
import { formApiSchema } from "./form.schema";
import { operateurApiSchema } from "./operateur.schema";
import { structureTypologieApiSchema } from "./structure-typologie.schema";

export const structureCreationApiSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: operateurApiSchema,
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType),
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
  nom: z.string().optional(),
  debutConvention: createNullableDateValidator().optional(),
  finConvention: createNullableDateValidator().optional(),
  cpom: z.boolean({
    message: "Le CPOM est requis",
  }),
  creationDate: z.coerce.date({ message: "La date de création est requise" }),
  finessCode: z.string().optional(),
  lgbt: z.boolean({
    message: "L'accueil de LGBT dans la structure est requis",
  }),
  fvvTeh: z.boolean({
    message: "L'accueil de FVV-TEH dans la structure est requis",
  }),
  public: z.nativeEnum(PublicType),
  debutPeriodeAutorisation: createNullableDateValidator().optional(),
  finPeriodeAutorisation: createNullableDateValidator().optional(),
  debutCpom: createNullableDateValidator().optional(),
  finCpom: createNullableDateValidator().optional(),
  adresses: z.array(adresseApiSchema),
  contacts: z.array(contactApiSchema),
  typologies: z.array(structureTypologieApiSchema),
  fileUploads: z.array(fileUploadApiSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const structureUpdateApiSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: operateurApiSchema.optional(),
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType).optional(),
  adresseAdministrative: z
    .string()
    .min(1, "L'adresse administrative est requise")
    .optional(),
  codePostalAdministratif: z
    .string()
    .min(1, "Le code postal administratif est requis")
    .optional(),
  communeAdministrative: z
    .string()
    .min(1, "La commune de l'adresse administrative est requise")
    .optional(),
  departementAdministratif: z
    .string()
    .min(1, "Le département de l'adresse administrative est requis")
    .optional(),
  nom: z.string().optional(),
  debutConvention: frDateField(),
  finConvention: frDateField(),
  cpom: z
    .boolean({
      message: "Le CPOM est requis",
    })
    .optional(),
  creationDate: frDateField(),
  finessCode: z.string().optional(),
  lgbt: z
    .boolean({
      message: "L'accueil de LGBT dans la structure est requis",
    })
    .optional(),
  fvvTeh: z
    .boolean({
      message: "L'accueil de FVV-TEH dans la structure est requis",
    })
    .optional(),
  public: z.nativeEnum(PublicType).optional(),
  debutPeriodeAutorisation: frDateField(),
  finPeriodeAutorisation: frDateField(),
  debutCpom: frDateField(),
  finCpom: frDateField(),
  placesACreer: z.number().int().optional(),
  placesAFermer: z.number().int().optional(),
  echeancePlacesACreer: frDateField(),
  echeancePlacesAFermer: frDateField(),
  notes: z.string().nullish(),
  state: z.nativeEnum(StructureState).optional(),
  adresses: z.array(adresseApiSchema).optional(),
  contacts: z.array(contactApiSchema).optional(),
  typologies: z.array(structureTypologieApiSchema).optional(),
  fileUploads: z.array(fileUploadApiSchema).optional(),
  budgets: z.array(budgetApiSchema).optional(),
  controles: z.array(controleApiSchema).optional(),
  forms: z.array(formApiSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type StructureCreationApiType = z.infer<
  typeof structureCreationApiSchema
>;

export type StructureUpdateApiType = z.infer<typeof structureUpdateApiSchema>;
