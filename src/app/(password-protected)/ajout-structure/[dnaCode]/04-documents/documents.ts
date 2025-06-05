import { FileUploadCategory } from "@/types/file-upload.type";

export const structureAutoriseesDocuments: StructureDocument[] = [
  {
    label: "Budget prévisionnel demandé",
    subLabel: "par l'opérateur",
    value: FileUploadCategory.BUDGET_PREVISIONNEL_DEMANDE,
    yearIndex: 0,
  },
  {
    label: "Rapport budgétaire (optionnel)",
    subLabel: "si séparé du budget prévisionnel demandé",
    value: FileUploadCategory.RAPPORT_BUDGETAIRE,
    yearIndex: 0,
  },
  {
    label: "Budget prévisionnel retenu (ou exécutoire)",
    subLabel: "par l'autorité de tarification",
    value: FileUploadCategory.BUDGET_PREVISIONNEL_RETENU,
    yearIndex: 1,
  },
  {
    label: "Budget réctificatif (optionnel)",
    subLabel: "intervenu en cours d'année",
    value: FileUploadCategory.BUDGET_RECTIFICATIF,
    yearIndex: 1,
  },
  {
    label: "Compte administratif soumis",
    subLabel: "par l'opérateur",
    value: FileUploadCategory.COMPTE_ADMINISTRATIF_SOUMIS,
    yearIndex: 1,
  },
  {
    label: "Rapport d'activité",
    subLabel: "qui accompagne le compte administratif soumis",
    value: FileUploadCategory.RAPPORT_ACTIVITE,
    yearIndex: 1,
  },
  {
    label: "Compte administratif retenu",
    subLabel: "par l'autorité de tarification",
    value: FileUploadCategory.COMPTE_ADMINISTRATIF_RETENU,
    yearIndex: 3,
  },
];
export const structureSubventionneesDocuments: StructureDocument[] = [
  {
    label: "Demande de subvention",
    value: FileUploadCategory.DEMANDE_SUBVENTION,
    yearIndex: 2,
  },
  {
    label: "Compte-rendu financier",
    value: FileUploadCategory.COMPTE_RENDU_FINANCIER,
    yearIndex: 2,
  },
  {
    label: "Rapport d'activité de l'opérateur",
    value: FileUploadCategory.RAPPORT_ACTIVITE_OPERATEUR,
    yearIndex: 2,
  },
];

export type StructureDocument = {
  label: string;
  subLabel?: string;
  value: string;
  yearIndex: number;
};
