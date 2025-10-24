import z from "zod";

import { mandatoryFrDateField } from "@/app/api/structures/structure.util";

export const budgetApiSchema = z.object({
  id: z.number().optional(),
  date: mandatoryFrDateField(),
  ETP: z.number().optional(),
  tauxEncadrement: z.number().optional(),
  coutJournalier: z.number().optional(),
  dotationDemandee: z.number().nullish(),
  dotationAccordee: z.number().nullish(),
  totalProduits: z.number().nullish(),
  totalCharges: z.number().nullish(),
  totalChargesProposees: z.number().nullish(),
  cumulResultatsNetsCPOM: z.number().nullish(),
  repriseEtat: z.number().nullish(),
  excedentRecupere: z.number().nullish(),
  excedentDeduit: z.number().nullish(),
  reserveInvestissement: z.number().nullish(),
  chargesNonReconductibles: z.number().nullish(),
  reserveCompensationDeficits: z.number().nullish(),
  reserveCompensationBFR: z.number().nullish(),
  reserveCompensationAmortissements: z.number().nullish(),
  fondsDedies: z.number().nullish(),
  affectationReservesFondsDedies: z.number().nullish(),
  reportANouveau: z.number().nullish(),
  autre: z.number().nullish(),
  commentaire: z.string().nullish(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type BudgetApiType = z.infer<typeof budgetApiSchema>;
