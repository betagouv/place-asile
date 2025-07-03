import { FileUploadCategory } from "@prisma/client";
import z from "zod";
import { zSafeNumber } from "@/app/utils/zodSafeNumber";

export type FinalisationFinanceFormValues = z.infer<
  typeof finalisationFinanceSchema
>;

export const finalisationFinanceSchema = z.object({
  fileUploads: z.array(
    z.object({
      key: z.string().optional(),
      category: z.nativeEnum(FileUploadCategory).optional(),
    })
  ),
  budget: z.array(
    z.object({
      // Gestion budgetaire
      ETP: zSafeNumber(),
      dotationDemandee: zSafeNumber(),
      dotationAccordee: zSafeNumber().nullable(),
      totalProduits: zSafeNumber().nullable(),
      totalCharges: zSafeNumber().nullable(),
      cumulResultatsNetsCPOM: zSafeNumber().optional().nullable(),
      repriseEtat: zSafeNumber().optional().nullable(),
      fondsDedies: zSafeNumber().optional().nullable(),

      // Détail affectation
      reserveInvestissement: zSafeNumber().nullable(),
      chargesNonReconductibles: zSafeNumber().nullable(),
      reserveCompensationDeficits: zSafeNumber().nullable(),
      reserveCompensationBFR: zSafeNumber().nullable(),
      reserveCompensationAmortissements: zSafeNumber().nullable(),

      tauxEncadrement: zSafeNumber(),
      coutJournalier: zSafeNumber(),
      commentaire: z.string().optional().nullable(),
    })
  ),
});
