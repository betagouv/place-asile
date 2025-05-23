export const structureAutoriseesDocuments: StructureDocument[] = [
  {
    label: "Budget prévisionnel demandé",
    value: "budgetPrevisionnelDemande",
    currentYear: true,
  },
  {
    label: "Budget prévisionnel retenu",
    value: "budgetPrevisionnelRetenu",
    currentYear: true,
  },
  {
    label: "Rapport budgétaire",
    value: "rapportBudgetaire",
    currentYear: true,
  },
  {
    label: "Budget réctificatif (optionnel)",
    value: "budgetRectificatif",
    currentYear: false,
  },
  {
    label: "Compte administratif soumis",
    value: "compteAdministratifSoumis",
    currentYear: false,
  },
  {
    label: "Compte administratif retenu",
    value: "compteAdministratifRetenu",
    currentYear: false,
  },
  {
    label: "Rapport d'activité",
    value: "rapportActivite",
    currentYear: false,
  },
];
export const structureSubventionneesDocuments: StructureDocument[] = [
  {
    label: "Demande de subvention",
    value: "demandeSubvention",
    currentYear: true,
  },
  {
    label: "Compte-rendu financier",
    value: "compteRenduFinancier",
    currentYear: false,
  },
  {
    label: "Rapport d'activité de l'opérateur",
    value: "rapportActiviteOperateur",
    currentYear: false,
  },
];

type StructureDocument = {
  label: string;
  value: string;
  currentYear: boolean;
};
