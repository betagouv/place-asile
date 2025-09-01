import z from "zod";

export type FileUpload = {
  id: number;
  structureDnaCode?: string;
  key: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
  date?: Date;
  category?: z.infer<typeof zDdetsFileUploadCategory>;
  startDate?: Date;
  endDate?: Date;
  categoryName?: string | null;
  parentFileUploadId?: number | null;
  childrenFileUploads?: FileUpload[];
};

export const FileUploadCategory = [
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
  "ARRETE_AUTORISATION",
  "CONVENTION",
  "ARRETE_TARIFICATION",
  "CPOM",
  "INSPECTION_CONTROLE",
  "AUTRE",
] as const;

export type FileUploadCategoryType = typeof FileUploadCategory;

export const zFileUploadCategory = z.enum(
  Object.values(FileUploadCategory) as unknown as FileUploadCategoryType
);

export const DdetsFileUploadCategory = [
  "INSPECTION_CONTROLE",
  "ARRETE_AUTORISATION",
  "CPOM",
  "CONVENTION",
  "ARRETE_TARIFICATION",
  "AUTRE",
] as const;

export type DdetsFileUploadCategoryType = typeof DdetsFileUploadCategory;

export const zDdetsFileUploadCategory = z.enum(
  Object.values(
    DdetsFileUploadCategory
  ) as unknown as DdetsFileUploadCategoryType
);
