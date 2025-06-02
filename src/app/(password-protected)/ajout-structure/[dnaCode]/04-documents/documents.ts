export const structureAutoriseesDocuments: StructureDocument[] = [
  {
    label: "Budget prévisionnel demandé",
    value: "budgetPrevisionnelDemande",
    yearIndex: 0,
  },
  {
    label: "Rapport budgétaire",
    value: "rapportBudgetaire",
    yearIndex: 0,
  },
  {
    label: "Budget prévisionnel retenu",
    value: "budgetPrevisionnelRetenu",
    yearIndex: 1,
  },
  {
    label: "Budget réctificatif (optionnel)", // TODO : gérer cette catégorie
    value: "budgetRectificatif",
    yearIndex: 1,
  },
  {
    label: "Compte administratif soumis",
    value: "compteAdministratifSoumis",
    yearIndex: 1,
  },
  {
    label: "Rapport d'activité",
    value: "rapportActivite",
    yearIndex: 1,
  },
  {
    label: "Compte administratif retenu",
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
  value: string;
  yearIndex: number;
};
