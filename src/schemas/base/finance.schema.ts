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
  ctx: z.RefinementCtx,
  cpom = true
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
    ];

    if (cpom) {
      requiredFields.push({ field: "fondsDedies", value: data.fondsDedies });
    }

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

const validateAffectationReservesDetailsSansCpom = (
  // Accepts partial data to handle missing properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Partial<any>,
  ctx: z.RefinementCtx
) => {
  return validateAffectationReservesDetails(data, ctx, false);
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
  ETP: zSafeDecimals(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),

  dotationDemandee: zSafeDecimals().nullable(),
  dotationAccordee: zSafeDecimals().nullable(),
  totalProduits: zSafeDecimals().nullable(),
  totalCharges: zSafeDecimals().nullable(),
  repriseEtat: zSafeDecimals().nullable(),
  excedentRecupere: zSafeDecimals().optional().nullable(),
  excedentDeduit: zSafeDecimals().optional().nullable(),
  affectationReservesFondsDedies: zSafeDecimals().nullable(),

  // Champs variables
  cumulResultatsNetsCPOM: zSafeDecimals().nullable(),
  totalChargesProposees: zSafeDecimals().nullable(),

  // Détail affectation
  reserveInvestissement: zSafeDecimals().optional().nullable(),
  chargesNonReconductibles: zSafeDecimals().optional().nullable(),
  reserveCompensationDeficits: zSafeDecimals().optional().nullable(),
  reserveCompensationBFR: zSafeDecimals().optional().nullable(),
  reserveCompensationAmortissements: zSafeDecimals().optional().nullable(),
  fondsDedies: zSafeDecimals().optional().nullable(),
  reportANouveau: zSafeDecimals().optional().nullable(),
  autre: zSafeDecimals().optional().nullable(),

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
    cumulResultatsNetsCPOM: zSafeDecimals().optional().nullable(),
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

const avecCpom = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeDecimals().optional().nullable(),
  })
  .superRefine(validateAffectationReservesDetails);

const autoriseeCurrentYear = budgetBaseSchema.extend({
  totalProduits: zSafeDecimals().optional().nullable(),
  totalCharges: zSafeDecimals().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeDecimals().optional().nullable(),
  repriseEtat: zSafeDecimals().optional().nullable(),
  totalChargesProposees: zSafeDecimals().optional().nullable(),
  affectationReservesFondsDedies: zSafeDecimals().optional().nullable(),
  fondsDedies: zSafeDecimals().optional().nullable(),
  reserveCompensationAmortissements: zSafeDecimals().optional().nullable(),
  reserveCompensationBFR: zSafeDecimals().optional().nullable(),
  reserveCompensationDeficits: zSafeDecimals().optional().nullable(),
  reserveInvestissement: zSafeDecimals().optional().nullable(),
  chargesNonReconductibles: zSafeDecimals().optional().nullable(),
});

const autoriseeY2 = budgetBaseSchema.extend({
  totalProduits: zSafeDecimals().optional().nullable(),
  totalCharges: zSafeDecimals().optional().nullable(),
  cumulResultatsNetsCPOM: zSafeDecimals().optional().nullable(),
  repriseEtat: zSafeDecimals().optional().nullable(),
  totalChargesProposees: zSafeDecimals().optional().nullable(),
  affectationReservesFondsDedies: zSafeDecimals().optional().nullable(),
  fondsDedies: zSafeDecimals().optional().nullable(),
  reserveCompensationAmortissements: zSafeDecimals().optional().nullable(),
  reserveCompensationBFR: zSafeDecimals().optional().nullable(),
  reserveCompensationDeficits: zSafeDecimals().optional().nullable(),
  reserveInvestissement: zSafeDecimals().optional().nullable(),
  chargesNonReconductibles: zSafeDecimals().optional().nullable(),
});

export const autoriseeSchema = z.object({
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    sansCpom,
    sansCpom,
    sansCpom,
  ]),
});

export const autoriseeAvecCpomSchema = z.object({
  // fileUploads: z.array(DocumentsTypeStrict),
  budgets: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    avecCpom,
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
  ETP: zSafeDecimals(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),
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

const subventionneeSansCpom = budgetBaseSchema.extend({
  cumulResultatsNetsCPOM: zSafeDecimals().optional().nullable(),
  affectationReservesFondsDedies: zSafeDecimals().optional().nullable(),
  chargesNonReconductibles: zSafeDecimals().optional().nullable(),
  reserveCompensationAmortissements: zSafeDecimals().optional().nullable(),
  reserveCompensationBFR: zSafeDecimals().optional().nullable(),
  reserveCompensationDeficits: zSafeDecimals().optional().nullable(),
  reserveInvestissement: zSafeDecimals().optional().nullable(),
  totalChargesProposees: zSafeDecimals().optional().nullable(),
});

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
