import z from "zod";

import { zSafeDecimalsNullish, zSafeYear } from "@/app/utils/zodCustomFields";
import { zSafeDecimals } from "@/app/utils/zodSafeDecimals";

import { validateAffectationReservesDetails } from "./validateAffectationReservesDetails";

export const budgetBaseSchema = z.object({
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

export const budgetSchema = budgetBaseSchema.superRefine(
  validateAffectationReservesDetails
);

export const budgetAutoSaveSchema = budgetBaseSchema
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
