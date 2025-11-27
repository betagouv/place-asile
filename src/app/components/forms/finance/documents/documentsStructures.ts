import { Granularity } from "@/types/documentfinancier";
import { DocumentFinancierCategoryType } from "@/types/file-upload.type";

export const structureAutoriseesDocuments: StructureDocument[] = [
  {
    label: "Budget prévisionnel demandé",
    subLabel: "par l'opérateur",
    value: "BUDGET_PREVISIONNEL_DEMANDE",
    yearIndex: 0,
    required: true,
  },
  {
    label: "Rapport budgétaire",
    subLabel: "si séparé du budget prévisionnel demandé",
    value: "RAPPORT_BUDGETAIRE",
    yearIndex: 0,
    required: false,
  },
  {
    label: "Budget prévisionnel retenu (ou exécutoire)",
    subLabel: "par l'autorité de tarification",
    value: "BUDGET_PREVISIONNEL_RETENU",
    yearIndex: 0,
    required: true,
  },
  {
    label: "Budget réctificatif",
    subLabel: "intervenu en cours d'année",
    value: "BUDGET_RECTIFICATIF",
    yearIndex: 1,
    required: false,
  },
  {
    label: "Compte administratif soumis",
    subLabel: "par l'opérateur",
    value: "COMPTE_ADMINISTRATIF_SOUMIS",
    yearIndex: 1,
    required: true,
  },
  {
    label: "Rapport d'activité",
    subLabel: "qui accompagne le compte administratif soumis",
    value: "RAPPORT_ACTIVITE",
    yearIndex: 1,
    required: true,
  },
  {
    label: "Compte administratif retenu",
    subLabel: "par l'autorité de tarification",
    value: "COMPTE_ADMINISTRATIF_RETENU",
    yearIndex: 2,
    required: true,
  },
  {
    label: "Autre document",
    subLabel: "nécessaires à l’analyse financière annuelle",
    value: "AUTRE_FINANCIER",
    yearIndex: 0,
    required: true,
  },
];
export const structureSubventionneesDocuments: StructureDocument[] = [
  {
    label: "Demande de subvention",
    value: "DEMANDE_SUBVENTION",
    yearIndex: 2,
    required: true,
  },
  {
    label: "Compte-rendu financier",
    value: "COMPTE_RENDU_FINANCIER",
    yearIndex: 2,
    required: true,
  },
  {
    label: "Rapport d'activité de l'opérateur",
    value: "RAPPORT_ACTIVITE_OPERATEUR",
    yearIndex: 2,
    required: true,
  },
  {
    label: "Autre document",
    subLabel: "nécessaires à l’analyse financière annuelle",
    value: "AUTRE_FINANCIER",
    yearIndex: 0,
    required: true,
  },
];

export const granularities: DocumentGranularity[] = [
  {
    label: "Structure",
    value: Granularity.STRUCTURE,
  },
  {
    label: "CPOM",
    value: Granularity.CPOM,
  },
  {
    label: "Structure et CPOM",
    value: Granularity.STRUCTURECPOM,
  },
];

export type StructureDocument = {
  label: string;
  subLabel?: string;
  value: DocumentFinancierCategoryType[number];
  yearIndex: number;
  required: boolean;
};

type DocumentGranularity = {
  label: string;
  value: Granularity;
};
