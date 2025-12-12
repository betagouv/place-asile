import { zSafeDecimalsNullish } from "@/app/utils/zodCustomFields";

import { budgetBaseSchema } from "./budget.base.schema";

export const autoriseeCurrentYearSchema = budgetBaseSchema.extend({
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

export const autoriseeY2Schema = budgetBaseSchema.extend({
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
