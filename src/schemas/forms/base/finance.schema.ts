import z from "zod";

import {
  frenchDateToISO,
  zSafeDecimalsNullish,
} from "@/app/utils/zodCustomFields";
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
  id: z.union([z.string().nullish(), zSafeDecimalsNullish()]),
  date: frenchDateToISO(),

  // Gestion budgetaire
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

  // Champs variables
  cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
  totalChargesProposees: zSafeDecimalsNullish(),

  // Détail affectation
  reserveInvestissement: zSafeDecimalsNullish(),
  chargesNonReconductibles: zSafeDecimalsNullish(),
  reserveCompensationDeficits: zSafeDecimalsNullish(),
  reserveCompensationBFR: zSafeDecimalsNullish(),
  reserveCompensationAmortissements: zSafeDecimalsNullish(),
  fondsDedies: zSafeDecimalsNullish(),
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
  })
  .partial()
  .extend({
    date: frenchDateToISO(),
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
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

const avecCpom = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeDecimalsNullish(),
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
  id: z.union([z.string().nullish(), zSafeDecimalsNullish()]),
  date: frenchDateToISO(),
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

const subventionneeSansCpom = budgetBaseSchema
  .extend({
    cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
    affectationReservesFondsDedies: zSafeDecimalsNullish(),
    chargesNonReconductibles: zSafeDecimalsNullish(),
    reserveCompensationAmortissements: zSafeDecimalsNullish(),
    reserveCompensationBFR: zSafeDecimalsNullish(),
    reserveCompensationDeficits: zSafeDecimalsNullish(),
    reserveInvestissement: zSafeDecimalsNullish(),
    totalChargesProposees: zSafeDecimalsNullish(),
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

export const subventionneeSchema = z.object({
  budgets: z.tuple([
    subventionneeFirstYears,
    subventionneeFirstYears,
    subventionneeSansCpom,
    subventionneeSansCpom,
    subventionneeSansCpom,
  ]),
});

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
