import z from "zod";

export const ActeAdministratifCategory = [
  "ARRETE_AUTORISATION",
  "CPOM",
  "CONVENTION",
  "ARRETE_TARIFICATION",
  "INSPECTION_CONTROLE",
  "EVALUATION",
  "AUTRE",
] as const;

export const DocumentFinancierCategory = [
  "BUDGET_PREVISIONNEL_DEMANDE",
  "RAPPORT_BUDGETAIRE",
  "BUDGET_PREVISIONNEL_RETENU",
  "BUDGET_RECTIFICATIF",
  "COMPTE_ADMINISTRATIF_SOUMIS",
  "RAPPORT_ACTIVITE",
  "COMPTE_ADMINISTRATIF_RETENU",
  "DEMANDE_SUBVENTION",
  "COMPTE_RENDU_FINANCIER",
  "RAPPORT_ACTIVITE_OPERATEUR",
] as const;

export type ActeAdministratifCategoryType = typeof ActeAdministratifCategory;
export type DocumentFinancierCategoryType = typeof DocumentFinancierCategory;

export const zActeAdministratifCategory = z.enum(
  Object.values(
    ActeAdministratifCategory
  ) as unknown as ActeAdministratifCategoryType
);

export const zDocumentFinancierCategory = z.enum(
  Object.values(
    DocumentFinancierCategory
  ) as unknown as DocumentFinancierCategoryType
);

export const FileUploadCategory = [
  ...ActeAdministratifCategory,
  ...DocumentFinancierCategory,
] as const;

export type FileUploadCategoryType = typeof FileUploadCategory;

export const zFileUploadCategory = z.enum(
  Object.values(FileUploadCategory) as unknown as FileUploadCategoryType
);
