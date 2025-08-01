import { Repartition } from "@/types/adresse.type";
import { ControleType } from "@/types/controle.type";
import { FileUploadCategory } from "@/types/file-upload.type";
import {
  PublicType,
  StructureType,
  StructureState,
} from "@/types/structure.type";
import { z } from "zod";
import { frDateField, mandatoryFrDateField } from "./structure.util";

const adresseTypologieSchema = z.object({
  nbPlacesTotal: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places total est requis"),
  date: z.coerce.date({
    message: "La date de la typologie d'adresse est requise",
  }),
  qpv: z.number().int(), // TODO : Gérer la validation de la valeur 0
  logementSocial: z.number().int(),
});

const adresseSchema = z.object({
  adresse: z.string().min(1, "L'adresse du logement est requise"),
  codePostal: z.string().min(1, "Le code postal du logement est requis"),
  commune: z.string().min(1, "Le code postal du logement est requis"),
  repartition: z.nativeEnum(Repartition),
  typologies: z.array(adresseTypologieSchema),
});

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom du contact est requis"),
  nom: z.string().min(1, "Le nom du contact est requis"),
  telephone: z.string().min(1, "Le numéro de téléphone du contact est requis"),
  email: z.string().email().min(1, "L'email du contact est requis"),
  role: z.string().min(1, "Le rôle du contact est requis"),
});

const structureTypologieSchema = z.object({
  date: z.coerce.date({ message: "La date de la typologie est requise" }),
  // TODO : ajouter nbPlaces
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
});

const fileUploadSchema = z.object({
  key: z.string().min(1, "La clé d'upload du fichier est requise"),
  date: z.coerce.date(),
  category: z.nativeEnum(FileUploadCategory),
});

export const structureCreationSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.string().min(1, "L'opérateur est requis"),
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType),
  nbPlaces: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places autorisées est requis"),
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
  debutConvention: z.coerce.date().optional(),
  finConvention: z.coerce.date().optional(),
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
  debutPeriodeAutorisation: z.coerce.date().optional(),
  finPeriodeAutorisation: z.coerce.date().optional(),
  debutCpom: z.coerce.date().optional(),
  finCpom: z.coerce.date().optional(),
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
  cumulResultatsNetsCPOM: z.number().nullable().optional(),
  repriseEtat: z.number().nullable().optional(),
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
  type: z.nativeEnum(ControleType),
  fileUploadKey: z.string(),
});

const updateStructureTypologieSchema = z.object({
  id: z.number().optional(),
  nbPlaces: z.number().int(),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
});

export const structureUpdateSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.string().min(1, "L'opérateur est requis").optional(),
  filiale: z.string().optional(),
  type: z.nativeEnum(StructureType).optional(),
  nbPlaces: z
    .number()
    .int()
    .positive()
    .min(1, "Le nombre de places autorisées est requis")
    .optional(),
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
  notes: z.string().optional().nullable(),
  state: z.nativeEnum(StructureState).optional(),
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
