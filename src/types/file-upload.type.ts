export type FileUpload = {
  id: number;
  structureDnaCode?: string;
  key: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
  date?: Date;
  category?: FileUploadCategoryType;
  startDate?: Date;
  endDate?: Date;
  categoryName?: string | null;
  parentFileUploadId?: number | null;
  childrenFileUploads?: FileUpload[];
};

export const FileUploadCategory = {
  BUDGET_PREVISIONNEL_DEMANDE: "budgetPrevisionnelDemande",
  RAPPORT_BUDGETAIRE: "rapportBudgetaire",
  BUDGET_PREVISIONNEL_RETENU: "budgetPrevisionnelRetenu",
  BUDGET_RECTIFICATIF: "budgetRectificatif",
  COMPTE_ADMINISTRATIF_SOUMIS: "compteAdministratifSoumis",
  RAPPORT_ACTIVITE: "rapportActivite",
  COMPTE_ADMINISTRATIF_RETENU: "compteAdministratifRetenu",
  DEMANDE_SUBVENTION: "demandeSubvention",
  COMPTE_RENDU_FINANCIER: "compteRenduFinancier",
  RAPPORT_ACTIVITE_OPERATEUR: "rapportActiviteOperateur",
  ARRETE_AUTORISATION: "arreteAutorisation",
  CONVENTION: "convention",
  ARRETE_TARIFICATION: "arreteTarification",
  CPOM: "cpom",
  INSPECTION_CONTROLE: "inspectionControle",
  AUTRE: "autre",
} as const;

export type FileUploadCategoryType = keyof typeof FileUploadCategory;
