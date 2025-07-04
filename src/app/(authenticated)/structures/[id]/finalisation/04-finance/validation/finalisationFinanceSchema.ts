import z from "zod";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";
import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
//
// Basic Schema
//
const budgetSchema = z.object({
  // Date
  id: zSafeNumber().optional().nullable(),
  date: z.coerce.date(),

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
  // TODO fix the cateogry type
  category: z.string(),
});

export const basicSchema = z.object({
  dnaCode: z.string(),
  fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
  ]),
});

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
  fondsDedies: zSafeNumber().optional().nullable(),
  reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
  reserveCompensationBFR: zSafeNumber().optional().nullable(),
  reserveCompensationDeficits: zSafeNumber().optional().nullable(),
  reserveInvestissement: zSafeNumber().optional().nullable(),
  chargesNonReconductibles: zSafeNumber().optional().nullable(),
});

const autoriseeY2 = budgetSchema.extend({
  totalProduits: zSafeNumber().optional().nullable(),
  totalCharges: zSafeNumber().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  repriseEtat: zSafeNumber().optional().nullable(),
  totalChargesProposees: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
  fondsDedies: zSafeNumber().optional().nullable(),
  reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
  reserveCompensationBFR: zSafeNumber().optional().nullable(),
  reserveCompensationDeficits: zSafeNumber().optional().nullable(),
  reserveInvestissement: zSafeNumber().optional().nullable(),
  chargesNonReconductibles: zSafeNumber().optional().nullable(),
});
const autoriseeY3 = budgetSchema.extend({
  totalCharges: zSafeNumber().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  repriseEtat: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
  fondsDedies: zSafeNumber().optional().nullable(),
  reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
  reserveCompensationBFR: zSafeNumber().optional().nullable(),
  reserveCompensationDeficits: zSafeNumber().optional().nullable(),
  reserveInvestissement: zSafeNumber().optional().nullable(),
  chargesNonReconductibles: zSafeNumber().optional().nullable(),
  totalChargesProposees: zSafeNumber().optional().nullable(),
});

export const autoriseeSchema = z.object({
  dnaCode: z.string(),
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    autoriseeY3,
    sansCpom,
    sansCpom,
  ]),
});

export const autoriseeAvecCpomSchema = z.object({
  dnaCode: z.string(),
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
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
  dnaCode: z.string(),
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    avecCpom,
    avecCpom,
    avecCpom,
  ]),
});

const subventionneeSansCpom = budgetSchema.extend({
  cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
  chargesNonReconductibles: zSafeNumber().optional().nullable(),
  reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
  reserveCompensationBFR: zSafeNumber().optional().nullable(),
  reserveCompensationDeficits: zSafeNumber().optional().nullable(),
  reserveInvestissement: zSafeNumber().optional().nullable(),
  totalChargesProposees: zSafeNumber().optional().nullable(),
});

export const subventionneeSchema = z.object({
  dnaCode: z.string(),
  // fileUploads: z.array(Document  sTypeStrict),
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    subventionneeSansCpom,
    subventionneeSansCpom,
    subventionneeSansCpom,
  ]),
});

// Types
export type basicSchemaTypeFormValues = z.infer<typeof basicSchema>;
export type autoriseeSchemaTypeFormValues = z.infer<typeof autoriseeSchema>;
export type autoriseeAvecCpomSchemaTypeFormValues = z.infer<
  typeof autoriseeAvecCpomSchema
>;
export type subventionneeSchemaTypeFormValues = z.infer<
  typeof subventionneeSchema
>;
export type subventionneeAvecCpomSchemaTypeFormValues = z.infer<
  typeof subventionneeAvecCpomSchema
>;

export type anyFinanceFormValues =
  | basicSchemaTypeFormValues
  | autoriseeSchemaTypeFormValues
  | autoriseeAvecCpomSchemaTypeFormValues
  | subventionneeSchemaTypeFormValues
  | subventionneeAvecCpomSchemaTypeFormValues;
