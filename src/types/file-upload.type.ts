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
  createdAt?: Date;
  lastUpdate?: Date;
};

export const DdetsFileUploadCategory = [
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

export type DdetsFileUploadCategoryType = typeof DdetsFileUploadCategory;
export type OperateurFileUploadCategoryType =
  typeof OperateurFileUploadCategory;

export const zDdetsFileUploadCategory = z.enum(
  Object.values(
    DdetsFileUploadCategory
  ) as unknown as DdetsFileUploadCategoryType
);

export const zOperateurFileUploadCategory = z.enum(
  Object.values(
    OperateurFileUploadCategory
  ) as unknown as OperateurFileUploadCategoryType
);

export const FileUploadCategory = [
  ...DdetsFileUploadCategory,
  ...OperateurFileUploadCategory,
] as const;

export type FileUploadCategoryType = typeof FileUploadCategory;

export const zFileUploadCategory = z.enum(
  Object.values(FileUploadCategory) as unknown as FileUploadCategoryType
);
