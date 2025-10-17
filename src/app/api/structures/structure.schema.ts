import { z } from "zod";

import { createNullableDateValidator } from "@/app/utils/zodCustomFields";
import { Repartition } from "@/types/adresse.type";
import { ContactType } from "@/types/contact.type";
import { ControleType } from "@/types/controle.type";
import { zFileUploadCategory } from "@/types/file-upload.type";
import { StepStatus } from "@/types/form.type";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

import { frDateField, mandatoryFrDateField } from "./structure.util";

const adresseTypologieSchema = z.object({
  placesAutorisees: z
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
  adresseTypologies: z.array(adresseTypologieSchema),
});

const contactSchema = z.object({
  prenom: z.string().min(1, "Le prénom du contact est requis"),
  nom: z.string().min(1, "Le nom du contact est requis"),
  telephone: z.string().min(1, "Le numéro de téléphone du contact est requis"),
  email: z.string().email().min(1, "L'email du contact est requis"),
  role: z.string().min(1, "Le rôle du contact est requis"),
  type: z.nativeEnum(ContactType).optional(),
});

const structureTypologieSchema = z.object({
  date: z.coerce.date({ message: "La date de la typologie est requise" }),
  placesAutorisees: z.number().int(),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
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
  adresses: z.array(adresseSchema),
  contacts: z.array(contactSchema),
  typologies: z.array(structureTypologieSchema),
  fileUploads: z.array(fileUploadSchema),
});

const budgetSchema = z.object({
  date: mandatoryFrDateField(),
  ETP: z.number().optional(),
  tauxEncadrement: z.number().optional(),
  coutJournalier: z.number().optional(),
  dotationDemandee: z.number().nullish(),
  dotationAccordee: z.number().nullish(),
  totalProduits: z.number().nullish(),
  totalCharges: z.number().nullish(),
  totalChargesProposees: z.number().nullish(),
  cumulResultatsNetsCPOM: z.number().nullish(),
  repriseEtat: z.number().nullish(),
  excedentRecupere: z.number().nullish(),
  excedentDeduit: z.number().nullish(),
  reserveInvestissement: z.number().nullish(),
  chargesNonReconductibles: z.number().nullish(),
  reserveCompensationDeficits: z.number().nullish(),
  reserveCompensationBFR: z.number().nullish(),
  reserveCompensationAmortissements: z.number().nullish(),
  fondsDedies: z.number().nullish(),
  affectationReservesFondsDedies: z.number().nullish(),
  reportANouveau: z.number().nullish(),
  autre: z.number().nullish(),
  commentaire: z.string().nullish(),
});

const controleSchema = z.object({
  id: z.number().optional(),
  date: frDateField(),
  type: z.nativeEnum(ControleType),
  fileUploadKey: z.string(),
});

const evaluationSchema = z.object({
  id: z.number().optional(),
  date: mandatoryFrDateField(),
  notePersonne: z.number().optional(),
  notePro: z.number().optional(),
  noteStructure: z.number().optional(),
  note: z.number().optional(),
  fileUploads: z.array(fileUploadSchema),
});

const updateStructureTypologieSchema = z.object({
  id: z.number().optional(),
  placesAutorisees: z.number().int(),
  pmr: z.number().int(),
  lgbt: z.number().int(),
  fvvTeh: z.number().int(),
});

const formSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  status: z.boolean(),
});

const formStepSchema = z.object({
  id: z.number().optional(),
  formId: z.number().optional(),
  slug: z.string(),
  status: z.nativeEnum(StepStatus),
});

export const structureUpdateSchema = z.object({
  dnaCode: z.string().min(1, "Le code DNA est requis"),
  operateur: z.object({ id: z.number(), name: z.string() }).optional(),
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
  adresses: z
    .array(adresseSchema.extend({ id: z.number().optional() }))
    .optional(),
  contacts: z
    .array(
      contactSchema.extend({
        id: z.number().optional(),
        type: z.nativeEnum(ContactType).optional(),
      })
    )
    .optional(),
  typologies: z.array(updateStructureTypologieSchema).optional(),
  fileUploads: z
    .array(
      fileUploadSchema.extend({
        date: frDateField(),
        startDate: frDateField(),
        endDate: frDateField(),
        categoryName: z.string().nullish(),
        parentFileUploadId: z.number().nullish(),
        controleId: z.number().optional(),
      })
    )
    .optional(),
  budgets: z
    .array(budgetSchema.extend({ id: z.number().optional() }))
    .optional(),
  controles: z
    .array(controleSchema.extend({ id: z.number().optional() }))
    .optional(),
  forms: z
    .array(
      formSchema.extend({
        id: z.number().optional(),
        slug: z.string(),
        formSteps: z.array(
          formStepSchema.extend({
            id: z.number().optional(),
            slug: z.string(),
            status: z.nativeEnum(StepStatus),
          })
        ),
      })
    )
    .optional(),
  evaluations: z
    .array(evaluationSchema.extend({ id: z.number().optional() }))
    .optional(),
});
