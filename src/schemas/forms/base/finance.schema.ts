import z from "zod";

import { frenchDateToISO } from "@/app/utils/zodCustomFields";
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
  id: z.union([z.string().nullish(), zSafeNumber().nullish()]),
  date: frenchDateToISO(),

  // Gestion budgetaire
  ETP: zSafeDecimals(),
  tauxEncadrement: zSafeDecimals(),
  coutJournalier: zSafeDecimals(),

  dotationDemandee: zSafeDecimals().nullable(),
  dotationAccordee: zSafeDecimals().nullable(),
  totalProduits: zSafeDecimals().nullable(),
  totalCharges: zSafeDecimals().nullable(),
  repriseEtat: zSafeDecimals().nullable(),
  excedentRecupere: zSafeDecimals().nullish(),
  excedentDeduit: zSafeDecimals().nullish(),
  affectationReservesFondsDedies: zSafeDecimals().nullable(),

  // Champs variables
  cumulResultatsNetsCPOM: zSafeDecimals().nullable(),
  totalChargesProposees: zSafeDecimals().nullable(),

  // Détail affectation
  reserveInvestissement: zSafeDecimals().nullish(),
  chargesNonReconductibles: zSafeDecimals().nullish(),
  reserveCompensationDeficits: zSafeDecimals().nullish(),
  reserveCompensationBFR: zSafeDecimals().nullish(),
  reserveCompensationAmortissements: zSafeDecimals().nullish(),
  fondsDedies: zSafeDecimals().nullish(),
  reportANouveau: zSafeDecimals().nullish(),
  autre: zSafeDecimals().nullish(),

  commentaire: z.string().nullish(),
});

const budgetSchema = budgetBaseSchema.superRefine(
  validateAffectationReservesDetails
);

const budgetAutoSaveSchema = budgetBaseSchema
  .extend({
    ETP: zSafeNumber()
      .nullable()
      .transform((val) => (val === null ? undefined : val)),
    tauxEncadrement: zSafeDecimals()
      .nullable()
      .transform((val) => (val === null ? undefined : val)),
    coutJournalier: zSafeDecimals()
      .nullable()
      .transform((val) => (val === null ? undefined : val)),
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
    cumulResultatsNetsCPOM: zSafeDecimals().nullish(),
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

const avecCpom = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeDecimals().nullish(),
  })
  .superRefine(validateAffectationReservesDetails);

const autoriseeCurrentYear = budgetBaseSchema.extend({
  totalProduits: zSafeDecimals().nullish(),
  totalCharges: zSafeDecimals().nullish(),
  cumulResultatsNetsCPOM: zSafeDecimals().nullish(),
  repriseEtat: zSafeDecimals().nullish(),
  totalChargesProposees: zSafeDecimals().nullish(),
  affectationReservesFondsDedies: zSafeDecimals().nullish(),
  fondsDedies: zSafeDecimals().nullish(),
  reserveCompensationAmortissements: zSafeDecimals().nullish(),
  reserveCompensationBFR: zSafeDecimals().nullish(),
  reserveCompensationDeficits: zSafeDecimals().nullish(),
  reserveInvestissement: zSafeDecimals().nullish(),
  chargesNonReconductibles: zSafeDecimals().nullish(),
});

const autoriseeY2 = budgetBaseSchema.extend({
  totalProduits: zSafeDecimals().nullish(),
  totalCharges: zSafeDecimals().nullish(),
  cumulResultatsNetsCPOM: zSafeDecimals().nullish(),
  repriseEtat: zSafeDecimals().nullish(),
  totalChargesProposees: zSafeDecimals().nullish(),
  affectationReservesFondsDedies: zSafeDecimals().nullish(),
  fondsDedies: zSafeDecimals().nullish(),
  reserveCompensationAmortissements: zSafeDecimals().nullish(),
  reserveCompensationBFR: zSafeDecimals().nullish(),
  reserveCompensationDeficits: zSafeDecimals().nullish(),
  reserveInvestissement: zSafeDecimals().nullish(),
  chargesNonReconductibles: zSafeDecimals().nullish(),
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
  id: z.union([z.string().nullish(), zSafeNumber().nullish()]),
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

const subventionneeSansCpom = budgetBaseSchema.extend({
  cumulResultatsNetsCPOM: zSafeDecimals().nullish(),
  affectationReservesFondsDedies: zSafeDecimals().nullish(),
  chargesNonReconductibles: zSafeDecimals().nullish(),
  reserveCompensationAmortissements: zSafeDecimals().nullish(),
  reserveCompensationBFR: zSafeDecimals().nullish(),
  reserveCompensationDeficits: zSafeDecimals().nullish(),
  reserveInvestissement: zSafeDecimals().nullish(),
  totalChargesProposees: zSafeDecimals().nullish(),
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
