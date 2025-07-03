export type FileUpload = {
  id: number;
  structureDnaCode?: string;
  key: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
  date?: Date;
  category?: FileUploadCategory;
  startDate?: Date;
  endDate?: Date;
};

export enum FileUploadCategory {
  BUDGET_PREVISIONNEL_DEMANDE = "budgetPrevisionnelDemande",
  RAPPORT_BUDGETAIRE = "rapportBudgetaire",
  BUDGET_PREVISIONNEL_RETENU = "budgetPrevisionnelRetenu",
  BUDGET_RECTIFICATIF = "budgetRectificatif",
  COMPTE_ADMINISTRATIF_SOUMIS = "compteAdministratifSoumis",
  RAPPORT_ACTIVITE = "rapportActivite",
  COMPTE_ADMINISTRATIF_RETENU = "compteAdministratifRetenu",
  DEMANDE_SUBVENTION = "demandeSubvention",
  COMPTE_RENDU_FINANCIER = "compteRenduFinancier",
  RAPPORT_ACTIVITE_OPERATEUR = "rapportActiviteOperateur",
}
