import {
  FileUploadCategoryType,
  FileUploadGranularityType,
} from "@/types/file-upload.type";

export const getCategoryLabel = (
  category: FileUploadCategoryType[number] | undefined
): string => {
  if (!category) {
    return "";
  }
  const labels: Record<FileUploadCategoryType[number], string> = {
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
    EVALUATION: "Évaluation",
    AUTRE: "Autre",
    AUTRE_FINANCIER: "Autre financier",
  };
  return labels[category] || "";
};

export const getGranularityLabel = (
  granularity: FileUploadGranularityType[number] | undefined
): string => {
  if (!granularity) {
    return "";
  }
  const labels: Record<FileUploadGranularityType[number], string> = {
    STRUCTURE: "Structure",
    CPOM: "CPOM",
    STRUCTURE_ET_CPOM: "Structure et CPOM",
  };
  return labels[granularity] || "";
};
