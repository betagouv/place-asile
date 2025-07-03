import z from "zod";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { FileUploadCategory, PublicType } from "@prisma/client";
import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
//
// Basic Schema
//
const budgetSchema = z.object({
  // Gestion budgetaire
  ETP: zSafeNumber(),
  tauxEncadrement: zSafeNumber(),
  coutJournalier: zSafeNumber(),

  dotationDemandee: zSafeNumber(),
  dotationAccordee: zSafeNumber().nullable(),
  totalProduits: zSafeNumber().nullable(),
  totalCharges: zSafeNumber().nullable(),
  repriseEtat: zSafeNumber().nullable(),
  affectationReservesFondsDedies: zSafeNumber().nullable(),

  // Champs variables
  cumulResultatsNetsCPOM: zSafeNumber().nullable(),
  totalChargesProposees: zSafeNumber().nullable(),

  // Détail affectation
  reserveInvestissement: zSafeNumber().nullable(),
  chargesNonReconductibles: zSafeNumber().nullable(),
  reserveCompensationDeficits: zSafeNumber().nullable(),
  reserveCompensationBFR: zSafeNumber().nullable(),
  reserveCompensationAmortissements: zSafeNumber().nullable(),
  fondsDedies: zSafeNumber().nullable(),

  commentaire: z.string().optional().nullable(),
});

export const DocumentsTypeStrict = z.object({
  key: z.string(),
  date: createDateFieldValidator(),
  category: z.nativeEnum(FileUploadCategory, {
    invalid_type_error:
      "La catégorie du document doit être de type : " +
      Object.values(PublicType).join(", "),
  }),
});

export const basicSchema = z.object({
  fileUploads: z.array(DocumentsTypeStrict),
  budget: z.tuple([
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
  ]),
});

export type basicSchemaTypeFormValues = z.infer<typeof basicSchema>;

//
// Structures Autorisées
//
const sansCpom = budgetSchema.extend({
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
});

const avecCpom = budgetSchema.extend({
  totalChargesProposees: zSafeNumber().optional().nullable(),
});

const autoriseeCurrentYear = budgetSchema.extend({
  dotationAccordee: zSafeNumber().optional().nullable(),
  totalProduits: zSafeNumber().optional().nullable(),
  totalCharges: zSafeNumber().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  repriseEtat: zSafeNumber().optional().nullable(),
  totalChargesProposees: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
});

const autoriseeY2 = budgetSchema.extend({
  totalProduits: zSafeNumber().optional().nullable(),
  totalCharges: zSafeNumber().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  repriseEtat: zSafeNumber().optional().nullable(),
  totalChargesProposees: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
});
const autoriseeY3 = budgetSchema.extend({
  totalCharges: zSafeNumber().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  repriseEtat: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
});

export const autoriseeSchema = z.object({
  fileUploads: z.array(DocumentsTypeStrict),
  budget: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    autoriseeY3,
    sansCpom,
    sansCpom,
  ]),
});

export const autoriseeAvecCpomSchema = z.object({
  fileUploads: z.array(DocumentsTypeStrict),
  budget: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    autoriseeY3,
    avecCpom,
    avecCpom,
  ]),
});

//
// Structures Subventionnées
//

const subventionneeFirstYears = z.object({
  ETP: zSafeNumber(),
  tauxEncadrement: zSafeNumber(),
  coutJournalier: zSafeNumber(),
});

export const subventionneeAvecCpomSchema = z.object({
  fileUploads: z.array(DocumentsTypeStrict),
  budget: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    avecCpom,
    avecCpom,
    avecCpom,
  ]),
});

const subventionneeSansCpom = budgetSchema.extend({
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
});

export const subventionneeSchema = z.object({
  fileUploads: z.array(DocumentsTypeStrict),
  budget: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    subventionneeSansCpom,
    subventionneeSansCpom,
    subventionneeSansCpom,
  ]),
});
