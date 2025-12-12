import { zSafeDecimalsNullish } from "@/app/utils/zodCustomFields";

import { budgetBaseSchema } from "./budget.base.schema";
import {
  validateAffectationReservesDetails,
  validateAffectationReservesDetailsSansCpom,
} from "./validateAffectationReservesDetails";

export const sansCpomSchema = budgetBaseSchema
  .extend({
    cumulResultatsNetsCPOM: zSafeDecimalsNullish(),
    excedentRecupere: zSafeDecimalsNullish(),
    excedentDeduit: zSafeDecimalsNullish(),
    fondsDedies: zSafeDecimalsNullish(),
  })
  .superRefine(validateAffectationReservesDetailsSansCpom);

export const avecCpomSchema = budgetBaseSchema
  .extend({
    totalChargesProposees: zSafeDecimalsNullish(),
    excedentRecupere: zSafeDecimalsNullish(),
    excedentDeduit: zSafeDecimalsNullish(),
    fondsDedies: zSafeDecimalsNullish(),
  })
  .superRefine(validateAffectationReservesDetails);
