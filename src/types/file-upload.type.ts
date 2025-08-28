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
  categoryName?: string;
  parentFileUploadId?: string;
  childrenFileUploads?: FileUpload[];
};

// export enum FileUploadCategory {
//   BUDGET_PREVISIONNEL_DEMANDE = "budgetPrevisionnelDemande",
//   RAPPORT_BUDGETAIRE = "rapportBudgetaire",
//   BUDGET_PREVISIONNEL_RETENU = "budgetPrevisionnelRetenu",
//   BUDGET_RECTIFICATIF = "budgetRectificatif",
//   COMPTE_ADMINISTRATIF_SOUMIS = "compteAdministratifSoumis",
//   RAPPORT_ACTIVITE = "rapportActivite",
//   COMPTE_ADMINISTRATIF_RETENU = "compteAdministratifRetenu",
//   DEMANDE_SUBVENTION = "demandeSubvention",
//   COMPTE_RENDU_FINANCIER = "compteRenduFinancier",
//   RAPPORT_ACTIVITE_OPERATEUR = "rapportActiviteOperateur",
//   ARRETE_AUTORISATION = "arreteAutorisation",
//   ARRETE_AUTORISATION_AVENANT = "arreteAutorisationAvenant",
//   CONVENTION = "convention",
//   CONVENTION_AVENANT = "convention_avenant",
//   ARRETE_TARIFICATION = "arreteTarification",
//   ARRETE_TARIFICATION_AVENANT = "arreteTarificationAvenant",
//   CPOM = "cpom",
//   CPOM_AVENANT = "cpomAvenant",
//   INSPECTION_CONTROLE = "inspectionControle",
//   AUTRE = "autre",
// }

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
  ARRETE_AUTORISATION_AVENANT: "arreteAutorisationAvenant",
  CONVENTION: "convention",
  CONVENTION_AVENANT: "convention_avenant",
  ARRETE_TARIFICATION: "arreteTarification",
  ARRETE_TARIFICATION_AVENANT: "arreteTarificationAvenant",
  CPOM: "cpom",
  CPOM_AVENANT: "cpomAvenant",
  INSPECTION_CONTROLE: "inspectionControle",
  AUTRE: "autre",
} as const;

export type FileUploadCategoryType = keyof typeof FileUploadCategory;
