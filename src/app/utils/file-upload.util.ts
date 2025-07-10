import { FileUploadCategory } from "@/types/file-upload.type";

export const getCategoryLabel = (
  category: keyof typeof FileUploadCategory | undefined
): string => {
  if (!category) {
    return "";
  }
  const labels: Record<keyof typeof FileUploadCategory, string> = {
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
    ARRETE_AUTORISATION_AVENANT: "Avenant arrêté d'autorisation",
    CONVENTION: "Convention",
    CONVENTION_AVENANT: "Avenant convention",
    ARRETE_TARIFICATION: "Arrêté de tarification",
    ARRETE_TARIFICATION_AVENANT: "Avenant arrêté de tarification",
    CPOM: "CPOM",
    CPOM_AVENANT: "Avenant CPOM",
    INSPECTION_CONTROLE: "Inspection contrôle",
    AUTRE: "Autre",
  };
  return labels[category] || "";
};
