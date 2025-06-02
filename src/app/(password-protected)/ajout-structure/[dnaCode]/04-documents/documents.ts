export const structureAutoriseesDocuments: StructureDocument[] = [
  {
    label: "Budget prévisionnel demandé",
    subLabel: "par l'opérateur",
    value: "budgetPrevisionnelDemande",
    yearIndex: 0,
  },
  {
    label: "Rapport budgétaire",
    subLabel: "qui accompagne le budget prévisionnel demandé",
    value: "rapportBudgetaire",
    yearIndex: 0,
  },
  {
    label: "Budget prévisionnel retenu",
    subLabel: "par l'autorité de tarification",
    value: "budgetPrevisionnelRetenu",
    yearIndex: 1,
  },
  {
    label: "Budget réctificatif (optionnel)",
    subLabel: "intervenu en cours d'année",
    value: "budgetRectificatif",
    yearIndex: 1,
  },
  {
    label: "Compte administratif soumis",
    subLabel: "par l'opérateur",
    value: "compteAdministratifSoumis",
    yearIndex: 1,
  },
  {
    label: "Rapport d'activité",
    subLabel: "qui accompagne le compte administratif soumis",
    value: "rapportActivite",
    yearIndex: 1,
  },
  {
    label: "Compte administratif retenu",
    subLabel: "par l'autorité de tarification",
    value: "compteAdministratifRetenu",
    yearIndex: 3,
  },
];
export const structureSubventionneesDocuments: StructureDocument[] = [
  {
    label: "Demande de subvention",
    value: "demandeSubvention",
    yearIndex: 2,
  },
  {
    label: "Compte-rendu financier",
    value: "compteRenduFinancier",
    yearIndex: 2,
  },
  {
    label: "Rapport d'activité de l'opérateur",
    value: "rapportActiviteOperateur",
    yearIndex: 2,
  },
];

export type StructureDocument = {
  label: string;
  subLabel?: string;
  value: string;
  yearIndex: number;
};
