import z from "zod";

import { zSafeDecimalsNullish, zSafeYear } from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";

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
      { field: "reportANouveau", value: data.reportANouveau },
      { field: "autre", value: data.autre },
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
  id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional()
  ),
  year: zSafeYear(),

  ETP: zSafeDecimals(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),

  dotationDemandee: zSafeDecimals(),
  dotationAccordee: zSafeDecimals(),
  totalProduits: zSafeDecimals(),
  totalCharges: zSafeDecimals(),
  repriseEtat: zSafeDecimals(),
  excedentRecupere: zSafeDecimals(),
  excedentDeduit: zSafeDecimals(),
  fondsDedies: zSafeDecimals(),

  affectationReservesFondsDedies: zSafeDecimals(),

  // Champs variables
  cumulResultatsNetsCPOM: zSafeDecimals(),
  totalChargesProposees: zSafeDecimals(),

  // Détail affectation
  reserveInvestissement: zSafeDecimalsNullish(),
  chargesNonReconductibles: zSafeDecimalsNullish(),
  reserveCompensationDeficits: zSafeDecimalsNullish(),
  reserveCompensationBFR: zSafeDecimalsNullish(),
  reserveCompensationAmortissements: zSafeDecimalsNullish(),
  reportANouveau: zSafeDecimalsNullish(),
  autre: zSafeDecimalsNullish(),

  commentaire: z.string().nullish(),
});

const budgetSchema = budgetBaseSchema.superRefine(
  validateAffectationReservesDetails
);

const budgetAutoSaveSchema = budgetBaseSchema
  .extend({
    ETP: zSafeDecimalsNullish(),
    tauxEncadrement: zSafeDecimalsNullish(),
    coutJournalier: zSafeDecimalsNullish(),
    dotationDemandee: zSafeDecimalsNullish(),
    dotationAccordee: zSafeDecimalsNullish(),
    totalProduits: zSafeDecimalsNullish(),
    totalCharges: zSafeDecimalsNullish(),
    repriseEtat: zSafeDecimalsNullish(),
    excedentRecupere: zSafeDecimalsNullish(),
    excedentDeduit: zSafeDecimalsNullish(),
    affectationReservesFondsDedies: zSafeDecimalsNullish(),
    cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
    totalChargesProposees: zSafeDecimalsNullish(),
    reserveInvestissement: zSafeDecimalsNullish(),
    chargesNonReconductibles: zSafeDecimalsNullish(),
    reserveCompensationDeficits: zSafeDecimalsNullish(),
    reserveCompensationBFR: zSafeDecimalsNullish(),
    reserveCompensationAmortissements: zSafeDecimalsNullish(),
    fondsDedies: zSafeDecimalsNullish(),
    reportANouveau: zSafeDecimalsNullish(),
    autre: zSafeDecimalsNullish(),
  })
  .partial()
  .extend({
    year: zSafeYear(),
  });

export const basicSchema = z.object({
  budgets: z.tuple([
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
    budgetSchema,
  ]),
});

export const basicAutoSaveSchema = z
  .object({
    budgets: z.tuple([
      budgetAutoSaveSchema,
      budgetAutoSaveSchema,
      budgetAutoSaveSchema,
      budgetAutoSaveSchema,
      budgetAutoSaveSchema,
    ]),
  })
  .partial();

//
// Structures Autorisées
//
const sansCpom = budgetBaseSchema
  .extend({
    cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
    excedentRecupere: zSafeDecimalsNullish(),
    excedentDeduit: zSafeDecimalsNullish(),
    fondsDedies: zSafeDecimalsNullish(),
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

const avecCpom = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeDecimalsNullish(),
    excedentRecupere: zSafeDecimalsNullish(),
    excedentDeduit: zSafeDecimalsNullish(),
    fondsDedies: zSafeDecimalsNullish(),
  })
  .superRefine(validateAffectationReservesDetails);

const autoriseeCurrentYear = budgetBaseSchema.extend({
  totalProduits: zSafeDecimalsNullish(),
  totalCharges: zSafeDecimalsNullish(),
  cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
  repriseEtat: zSafeDecimalsNullish(),
  totalChargesProposees: zSafeDecimalsNullish(),
  affectationReservesFondsDedies: zSafeDecimalsNullish(),
  fondsDedies: zSafeDecimalsNullish(),
  reserveCompensationAmortissements: zSafeDecimalsNullish(),
  reserveCompensationBFR: zSafeDecimalsNullish(),
  reserveCompensationDeficits: zSafeDecimalsNullish(),
  reserveInvestissement: zSafeDecimalsNullish(),
  chargesNonReconductibles: zSafeDecimalsNullish(),
  excedentRecupere: zSafeDecimalsNullish(),
  excedentDeduit: zSafeDecimalsNullish(),
});

const autoriseeY2 = budgetBaseSchema.extend({
  totalProduits: zSafeDecimalsNullish(),
  totalCharges: zSafeDecimalsNullish(),
  cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
  repriseEtat: zSafeDecimalsNullish(),
  totalChargesProposees: zSafeDecimalsNullish(),
  affectationReservesFondsDedies: zSafeDecimalsNullish(),
  fondsDedies: zSafeDecimalsNullish(),
  reserveCompensationAmortissements: zSafeDecimalsNullish(),
  reserveCompensationBFR: zSafeDecimalsNullish(),
  reserveCompensationDeficits: zSafeDecimalsNullish(),
  reserveInvestissement: zSafeDecimalsNullish(),
  chargesNonReconductibles: zSafeDecimalsNullish(),
  excedentRecupere: zSafeDecimalsNullish(),
  excedentDeduit: zSafeDecimalsNullish(),
});

export const autoriseeSchema = z.object({
  budgets: z.tuple([
    autoriseeCurrentYear,
    autoriseeY2,
    sansCpom,
    sansCpom,
    sansCpom,
  ]),
});

export const autoriseeAvecCpomSchema = z.object({
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
  id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().optional()
  ),
  year: zSafeYear(),
  ETP: zSafeDecimals(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),
});

export const subventionneeAvecCpomSchema = z.object({
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    avecCpom,
    avecCpom,
    avecCpom,
  ]),
});

const subventionneeSansCpom = budgetBaseSchema.extend({
  cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
  affectationReservesFondsDedies: zSafeDecimalsNullish(),
  chargesNonReconductibles: zSafeDecimalsNullish(),
  reserveCompensationAmortissements: zSafeDecimalsNullish(),
  reserveCompensationBFR: zSafeDecimalsNullish(),
  reserveCompensationDeficits: zSafeDecimalsNullish(),
  reserveInvestissement: zSafeDecimalsNullish(),
  totalChargesProposees: zSafeDecimalsNullish(),
});

export const subventionneeSchema = z.object({
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    subventionneeSansCpom,
    subventionneeSansCpom,
    subventionneeSansCpom,
  ]),
});

type budgetSchemaTypeFormValues = z.infer<typeof budgetSchema>;
export type budgetsSchemaTypeFormValues = [
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
  budgetSchemaTypeFormValues,
];

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

export type basicAutoSaveFormValues = z.infer<typeof basicAutoSaveSchema>;
