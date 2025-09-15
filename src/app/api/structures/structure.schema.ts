import { z } from "zod";

import { createNullableDateValidator } from "@/app/utils/zodCustomFields";
import { Repartition } from "@/types/adresse.type";
import { ControleType } from "@/types/controle.type";
import { zFileUploadCategory } from "@/types/file-upload.type";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

import { frDateField, mandatoryFrDateField } from "./structure.util";

const adresseTypologieSchema = z.object({
  placesAutorisees: z.int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  date: z.coerce.date({
      error: "La date de la typologie d'adresse est requise"
}),
  qpv: z.int(), // TODO : Gérer la validation de la valeur 0
  logementSocial: z.int(),
});

const adresseSchema = z.object({
  adresse: z.string().min(1, "L'adresse du logement est requise"),
  codePostal: z.string().min(1, "Le code postal du logement est requis"),
  commune: z.string().min(1, "Le code postal du logement est requis"),
  repartition: z.enum(Repartition),
  typologies: z.array(adresseTypologieSchema),
});

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom du contact est requis"),
  nom: z.string().min(1, "Le nom du contact est requis"),
  telephone: z.string().min(1, "Le numéro de téléphone du contact est requis"),
  email: z.email().min(1, "L'email du contact est requis"),
  role: z.string().min(1, "Le rôle du contact est requis"),
});

const structureTypologieSchema = z.object({
  date: z.coerce.date({
      error: "La date de la typologie est requise"
}),
  placesAutorisees: z.int(),
  pmr: z.int(),
  lgbt: z.int(),
  fvvTeh: z.int(),
});

const fileUploadSchema = z.object({
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  date: z.coerce.date(),
  category: zFileUploadCategory,
});

export const structureCreationSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.object({ id: z.number(), name: z.string() }),
  filiale: z.string().optional(),
  type: z.enum(StructureType),
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
      error: "Le CPOM est requis"
}),
  creationDate: z.coerce.date({
      error: "La date de création est requise"
}),
  finessCode: z.string().optional(),
  lgbt: z.boolean({
      error: "L'accueil de LGBT dans la structure est requis"
}),
  fvvTeh: z.boolean({
      error: "L'accueil de FVV-TEH dans la structure est requis"
}),
  public: z.enum(PublicType),
  debutPeriodeAutorisation: createNullableDateValidator().optional(),
  finPeriodeAutorisation: createNullableDateValidator().optional(),
  debutCpom: createNullableDateValidator().optional(),
  finCpom: createNullableDateValidator().optional(),
  adresses: z.array(adresseSchema),
  contacts: z.array(contactSchema),
  typologies: z.array(structureTypologieSchema),
  fileUploads: z.array(fileUploadSchema),
});

const budgetSchema = z.object({
  date: mandatoryFrDateField(),
  ETP: z.number(),
  tauxEncadrement: z.number(),
  coutJournalier: z.number(),
  dotationDemandee: z.number().nullable().optional(),
  dotationAccordee: z.number().nullable().optional(),
  totalProduits: z.number().nullable().optional(),
  totalCharges: z.number().nullable().optional(),
  totalChargesProposees: z.number().nullable().optional(),
  cumulResultatsNetsCPOM: z.number().nullable().optional(),
  repriseEtat: z.number().nullable().optional(),
  excedentRecupere: z.number().nullable().optional(),
  excedentDeduit: z.number().nullable().optional(),
  reserveInvestissement: z.number().nullable().optional(),
  chargesNonReconductibles: z.number().nullable().optional(),
  reserveCompensationDeficits: z.number().nullable().optional(),
  reserveCompensationBFR: z.number().nullable().optional(),
  reserveCompensationAmortissements: z.number().nullable().optional(),
  fondsDedies: z.number().nullable().optional(),
  affectationReservesFondsDedies: z.number().nullable().optional(),
  commentaire: z.string().nullable().optional(),
});

const controleSchema = z.object({
  date: z.coerce.date(),
  type: z.enum(ControleType),
  fileUploadKey: z.string(),
});

const updateStructureTypologieSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: z.int(),
  pmr: z.int(),
  lgbt: z.int(),
  fvvTeh: z.int(),
});

export const structureUpdateSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.object({ id: z.number(), name: z.string() }).optional(),
  filiale: z.string().optional(),
  type: z.enum(StructureType).optional(),
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
        error: "Le CPOM est requis"
    })
    .optional(),
  creationDate: frDateField(),
  finessCode: z.string().optional(),
  lgbt: z
    .boolean({
        error: "L'accueil de LGBT dans la structure est requis"
    })
    .optional(),
  fvvTeh: z
    .boolean({
        error: "L'accueil de FVV-TEH dans la structure est requis"
    })
    .optional(),
  public: z.enum(PublicType).optional(),
  debutPeriodeAutorisation: frDateField(),
  finPeriodeAutorisation: frDateField(),
  debutCpom: frDateField(),
  finCpom: frDateField(),
  placesACreer: z.int().optional(),
  placesAFermer: z.int().optional(),
  echeancePlacesACreer: frDateField(),
  echeancePlacesAFermer: frDateField(),
  notes: z.string().optional().nullable(),
  state: z.enum(StructureState).optional(),
  adresses: z
    .array(adresseSchema.extend({ id: z.number().optional() }))
    .optional(),
  contacts: z
    .array(contactSchema.extend({ id: z.number().optional() }))
    .optional(),
  typologies: z.array(updateStructureTypologieSchema).optional(),
  fileUploads: z
    .array(
      fileUploadSchema.extend({
        date: frDateField(),
        startDate: frDateField(),
        endDate: frDateField(),
        categoryName: z.string().optional(),
        parentFileUploadId: z.number().optional(),
      })
    )
    .optional(),
  budgets: z
    .array(budgetSchema.extend({ id: z.number().optional() }))
    .optional(),
  controles: z
    .array(controleSchema.extend({ id: z.number().optional() }))
    .optional(),
});
