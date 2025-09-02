import { zFileUploadCategory } from "@/types/file-upload.type";
import z from "zod";

export const getCategoryLabel = (
  category: z.infer<typeof zFileUploadCategory> | undefined
): string => {
  if (!category) {
    return "";
  }
  const labels: Record<z.infer<typeof zFileUploadCategory>, string> = {
    BUDGET_PREVISIONNEL_DEMANDE: "Budget prévisionnel demandé",
    RAPPORT_BUDGETAIRE: "Rapport budgétaire",
    BUDGET_PREVISIONNEL_RETENU: "Budget prévisionnel retenu",
    BUDGET_RECTIFICATIF: "Budget rectificatif",
    COMPTE_ADMINISTRATIF_SOUMIS: "Compte administratif soumis",
    RAPPORT_ACTIVITE: "Rapport d'activité",
    COMPTE_ADMINISTRATIF_RETENU: "Compte administratif retenu",
    DEMANDE_SUBVENTION: "Demande de subvention",
    COMPTE_RENDU_FINANCIER: "Compte-rendu financier",
    RAPPORT_ACTIVITE_OPERATEUR: "Rapport d'activité de l'opérateur",
    ARRETE_AUTORISATION: "Arrêté d'autorisation",
    CONVENTION: "Convention",
    ARRETE_TARIFICATION: "Arrêté de tarification",
    CPOM: "CPOM",
    INSPECTION_CONTROLE: "Inspection contrôle",
    AUTRE: "Autre",
  };
  return labels[category] || "";
};
