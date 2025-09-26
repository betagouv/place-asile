import z from "zod";

import { createDateFieldValidator } from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

/**
 * Checks that if the `affectationReservesFondsDedies` field is greater than 0 (or not null),
 * then the associated detail fields (reserves and dedicated funds) must not be empty.
 * If any of these fields are empty, a custom validation error is added.
 */
const validateAffectationReservesDetails = (
  // Accepts partial data to handle missing properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Partial<any>,
  ctx: z.RefinementCtx
) => {
  // If affectationReservesFondsDedies is not equal to 0, then the detail fields are required
  if (
    data.affectationReservesFondsDedies !== null &&
    data.affectationReservesFondsDedies !== 0
  ) {
    const requiredFields = [
      { field: "reserveInvestissement", value: data.reserveInvestissement },
      {
        field: "chargesNonReconductibles",
        value: data.chargesNonReconductibles,
      },
      {
        field: "reserveCompensationDeficits",
        value: data.reserveCompensationDeficits,
      },
      { field: "reserveCompensationBFR", value: data.reserveCompensationBFR },
      {
        field: "reserveCompensationAmortissements",
        value: data.reserveCompensationAmortissements,
      },
      { field: "fondsDedies", value: data.fondsDedies },
    ];

    requiredFields.forEach(({ field, value }) => {
      if (value === null || value === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message:
            "Ce champ est requis si l'affectation des réserves et fonds dédiés est supérieure à 0.",
        });
      }
    });
  }
};

const budgetBaseSchema = z.object({
  // Date
  // TODO : vérifier que c'est plutôt un number
  id: z.union([
    z.string().nullable().optional(),
    zSafeNumber().nullable().optional(),
  ]),
  date: createDateFieldValidator(),

  // Gestion budgetaire
  ETP: zSafeNumber(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),

  dotationDemandee: zSafeNumber().nullable(),
  dotationAccordee: zSafeNumber().nullable(),
  totalProduits: zSafeNumber().nullable(),
  totalCharges: zSafeNumber().nullable(),
  repriseEtat: zSafeNumber().nullable(),
  excedentRecupere: zSafeNumber().optional().nullable(),
  excedentDeduit: zSafeNumber().optional().nullable(),
  affectationReservesFondsDedies: zSafeNumber().nullable(),

  // Champs variables
  cumulResultatsNetsCPOM: zSafeNumber().nullable(),
  totalChargesProposees: zSafeNumber().nullable(),

  // Détail affectation
  reserveInvestissement: zSafeNumber().optional().nullable(),
  chargesNonReconductibles: zSafeNumber().optional().nullable(),
  reserveCompensationDeficits: zSafeNumber().optional().nullable(),
  reserveCompensationBFR: zSafeNumber().optional().nullable(),
  reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
  fondsDedies: zSafeNumber().optional().nullable(),

  commentaire: z.string().optional().nullable(),
});

const budgetSchema = budgetBaseSchema.superRefine(
  validateAffectationReservesDetails
);

export const DocumentsTypeStrict = z.object({
  key: z.string(),
  date: createDateFieldValidator(),
  // TODO fix the cateogry type
  category: z.string(),
});

export const basicSchema = z.object({
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
const sansCpom = budgetBaseSchema
  .extend({
    cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
  })
  .superRefine(validateAffectationReservesDetails);

const avecCpom = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeNumber().optional().nullable(),
  })
  .superRefine(validateAffectationReservesDetails);

const autoriseeCurrentYear = budgetBaseSchema.extend({
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

const autoriseeY2 = budgetBaseSchema.extend({
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

const autoriseeY3 = budgetBaseSchema.extend({
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
  id: z.union([
    z.string().nullable().optional(),
    zSafeNumber().nullable().optional(),
  ]),
  date: createDateFieldValidator(),
  ETP: zSafeNumber(),
  tauxEncadrement: zSafeNumber(),
  coutJournalier: zSafeNumber(),
});

export const subventionneeAvecCpomSchema = z.object({
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    avecCpom,
    avecCpom,
    avecCpom,
  ]),
});

const subventionneeSansCpom = budgetBaseSchema
  .extend({
    cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
    affectationReservesFondsDedies: zSafeNumber().optional().nullable(),
    chargesNonReconductibles: zSafeNumber().optional().nullable(),
    reserveCompensationAmortissements: zSafeNumber().optional().nullable(),
    reserveCompensationBFR: zSafeNumber().optional().nullable(),
    reserveCompensationDeficits: zSafeNumber().optional().nullable(),
    reserveInvestissement: zSafeNumber().optional().nullable(),
    totalChargesProposees: zSafeNumber().optional().nullable(),
  })
  .superRefine(validateAffectationReservesDetails);

export const subventionneeSchema = z.object({
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
