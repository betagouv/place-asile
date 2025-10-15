import z from "zod";

export type FileUpload = {
  id: number;
  structureDnaCode?: string;
  key: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
  date?: Date;
  category?: z.infer<typeof zFileUploadCategory>;
  startDate?: Date;
  endDate?: Date;
  categoryName?: string | null;
  parentFileUploadId?: number | null;
  childrenFileUploads?: FileUpload[];
};

export const AgentFileUploadCategory = [
  "ARRETE_AUTORISATION",
  "CPOM",
  "CONVENTION",
  "ARRETE_TARIFICATION",
  "INSPECTION_CONTROLE",
  "AUTRE",
] as const;

export const OperateurFileUploadCategory = [
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

export type AgentFileUploadCategoryType = typeof AgentFileUploadCategory;
export type OperateurFileUploadCategoryType =
  typeof OperateurFileUploadCategory;

export const zAgentFileUploadCategory = z.enum(
  Object.values(
    AgentFileUploadCategory
  ) as unknown as AgentFileUploadCategoryType
);

export const zOperateurFileUploadCategory = z.enum(
  Object.values(
    OperateurFileUploadCategory
  ) as unknown as OperateurFileUploadCategoryType
);

export const FileUploadCategory = [
  ...AgentFileUploadCategory,
  ...OperateurFileUploadCategory,
] as const;

export type FileUploadCategoryType = typeof FileUploadCategory;

export const zFileUploadCategory = z.enum(
  Object.values(FileUploadCategory) as unknown as FileUploadCategoryType
);

export enum FileMetaData {
  INSPECTION_CONTROLE,
  DATE_START_END,
  NAME,
}
