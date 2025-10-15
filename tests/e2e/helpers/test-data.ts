import { Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

// Helper to generate finance data for AUTORISEE structures (CADA, CPH)
const createAutoriseeFinanceData = () => ({
  budgets: [
    // Year 1 & 2: Current and forecast years (more fields required)
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
    },
    // Years 3, 4, 5: Historical years (require full budget fields)
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
  ],
});

// Helper to generate finance data for SUBVENTIONNEE structures (HUDA, CAES)
const createSubventionneeFinanceData = () => ({
  budgets: [
    // Year 1 & 2: Only basic indicators required for subventionnée
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
    },
    // Years 3, 4, 5: Historical years (require full budget fields)
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
    {
      ETP: 10,
      tauxEncadrement: 0.5,
      coutJournalier: 50,
      dotationDemandee: 100000,
      dotationAccordee: 100000,
      totalProduits: 100000,
      totalChargesProposees: 95000,
      totalCharges: 95000,
      repriseEtat: 0,
      affectationReservesFondsDedies: 0,
    },
  ],
});

export type TestStructureData = {
  dnaCode: string;
  type: StructureType;
  cpom: boolean;
  identification: {
    filiale?: string;
    operateur: {
      name: string;
      searchTerm: string;
    };
    creationDate: string;
    finessCode?: string;
    public: string;
    lgbt: boolean;
    fvvTeh: boolean;
    contactPrincipal?: {
      prenom: string;
      nom: string;
      role: string;
      email: string;
      telephone: string;
    };
    contactSecondaire?: {
      prenom: string;
      nom: string;
      role: string;
      email: string;
      telephone: string;
    };
    debutPeriodeAutorisation?: string;
    finPeriodeAutorisation?: string;
    debutConvention?: string;
    finConvention?: string;
    debutCpom?: string;
    finCpom?: string;
  };
  adresses: {
    nom?: string;
    adresseAdministrative: {
      complete: string;
      searchTerm: string;
    };
    typeBati: Repartition;
    sameAddress: boolean;
    adresses?: Array<{
      adresseComplete: string;
      searchTerm: string;
      placesAutorisees: number;
      repartition?: Repartition;
    }>;
  };
  typologies: Array<{
    placesAutorisees: number;
    pmr: number;
    lgbt: number;
    fvvTeh: number;
  }>;
  documents: {
    less5Years: boolean;
    files: Array<{
      year: string;
      category: string;
      fileName: string;
      filePath: string;
    }>;
  };
  finalisation?: {
    finance?: {
      budgets: Array<{
        ETP: number;
        tauxEncadrement: number;
        coutJournalier: number;
        dotationDemandee?: number;
        dotationAccordee?: number;
        totalProduits?: number;
        totalChargesProposees?: number;
        totalCharges?: number;
        repriseEtat?: number;
        affectationReservesFondsDedies?: number;
      }>;
    };
    typePlaces?: {
      placesACreer: number;
      placesAFermer: number;
      echeancePlacesACreer?: string;
      echeancePlacesAFermer?: string;
    };
    notes?: string;
  };
};

export const cadaSansCpom: TestStructureData = {
  dnaCode: "C1234",
  type: StructureType.CADA,
  cpom: false,
  identification: {
    filiale: "Filiale Test",
    operateur: {
      name: "Opérateur Test",
      searchTerm: "Opér",
    },
    creationDate: "2015-06-01T00:00:00.000Z",
    finessCode: "123456789",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "John",
      nom: "Doe",
      role: "Directeur·rice",
      email: "john.doe@example.com",
      telephone: "+33123456789",
    },
    contactSecondaire: {
      prenom: "Jane",
      nom: "Deo",
      role: "Responsable administratif",
      email: "jane.deo@example.com",
      telephone: "+33623456789",
    },
    debutPeriodeAutorisation: "2020-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2025-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Test",
    adresseAdministrative: {
      complete: "1 Rue de la Paix 75001 Paris",
      searchTerm: "1 rue de la paix paris",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 50,
      pmr: 5,
      lgbt: 10,
      fvvTeh: 8,
    },
    {
      placesAutorisees: 48,
      pmr: 5,
      lgbt: 10,
      fvvTeh: 8,
    },
    {
      placesAutorisees: 45,
      pmr: 4,
      lgbt: 8,
      fvvTeh: 7,
    },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
  finalisation: {
    finance: createAutoriseeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CADA sans CPOM finalisée avec succès",
  },
};

export const cadaAvecCpom: TestStructureData = {
  ...cadaSansCpom,
  cpom: true,
  identification: {
    ...cadaSansCpom.identification,
    debutCpom: "2023-01-01T00:00:00.000Z",
    finCpom: "2027-12-31T00:00:00.000Z",
  },
  finalisation: {
    finance: createAutoriseeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CADA avec CPOM finalisée avec succès",
  },
};

// CPH (Centre Provisoire d'Hébergement) - Structure autorisée
export const cphSansCpom: TestStructureData = {
  dnaCode: "R1234",
  type: StructureType.CPH,
  cpom: false,
  identification: {
    filiale: "Filiale CPH",
    operateur: {
      name: "Opérateur CPH",
      searchTerm: "Opér",
    },
    creationDate: "2016-03-15T00:00:00.000Z",
    finessCode: "987654321",
    public: "Tout public",
    lgbt: false,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Marie",
      nom: "Martin",
      role: "Directeur·rice",
      email: "marie.martin@example.com",
      telephone: "+33234567890",
    },
    contactSecondaire: {
      prenom: "Paul",
      nom: "Durand",
      role: "Responsable administratif",
      email: "paul.durand@example.com",
      telephone: "+33734567890",
    },
    debutPeriodeAutorisation: "2021-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2026-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CPH Test",
    adresseAdministrative: {
      complete: "10 Avenue des Champs-Élysées 75008 Paris",
      searchTerm: "10 avenue champs elysees paris",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    { placesAutorisees: 40, pmr: 4, lgbt: 5, fvvTeh: 6 },
    { placesAutorisees: 38, pmr: 4, lgbt: 5, fvvTeh: 6 },
    { placesAutorisees: 35, pmr: 3, lgbt: 4, fvvTeh: 5 },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
  finalisation: {
    finance: createAutoriseeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CPH sans CPOM finalisée avec succès",
  },
};

export const cphAvecCpom: TestStructureData = {
  ...cphSansCpom,
  cpom: true,
  identification: {
    ...cphSansCpom.identification,
    debutCpom: "2023-06-01T00:00:00.000Z",
    finCpom: "2028-05-31T00:00:00.000Z",
  },
  finalisation: {
    finance: createAutoriseeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CPH avec CPOM finalisée avec succès",
  },
};

// HUDA (Hébergement d'Urgence pour Demandeurs d'Asile) - Structure subventionnée
export const hudaSansCpom: TestStructureData = {
  dnaCode: "H1234",
  type: StructureType.HUDA,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur HUDA",
      searchTerm: "Opér",
    },
    creationDate: "2017-09-01T00:00:00.000Z",
    public: "Famille",
    lgbt: true,
    fvvTeh: false,
    contactPrincipal: {
      prenom: "Sophie",
      nom: "Legrand",
      role: "Directeur·rice",
      email: "sophie.legrand@example.com",
      telephone: "+33345678901",
    },
    debutConvention: "2022-01-01T00:00:00.000Z",
    finConvention: "2025-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "HUDA Test",
    adresseAdministrative: {
      complete: "25 Rue de la République 69002 Lyon",
      searchTerm: "25 rue republique lyon",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    { placesAutorisees: 60, pmr: 6, lgbt: 8, fvvTeh: 5 },
    { placesAutorisees: 58, pmr: 6, lgbt: 8, fvvTeh: 5 },
    { placesAutorisees: 55, pmr: 5, lgbt: 7, fvvTeh: 4 },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
  finalisation: {
    finance: createSubventionneeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure HUDA sans CPOM finalisée avec succès",
  },
};

export const hudaAvecCpom: TestStructureData = {
  ...hudaSansCpom,
  cpom: true,
  identification: {
    ...hudaSansCpom.identification,
    debutCpom: "2024-01-01T00:00:00.000Z",
    finCpom: "2028-12-31T00:00:00.000Z",
  },
  finalisation: {
    finance: createSubventionneeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure HUDA avec CPOM finalisée avec succès",
  },
};

// CAES (Centre d'Accueil et d'Examen des Situations) - Structure subventionnée
export const caesSansCpom: TestStructureData = {
  dnaCode: "K1234",
  type: StructureType.CAES,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur CAES",
      searchTerm: "Opér",
    },
    creationDate: "2018-04-20T00:00:00.000Z",
    public: "Personnes isolées",
    lgbt: false,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Pierre",
      nom: "Dubois",
      role: "Directeur·rice",
      email: "pierre.dubois@example.com",
      telephone: "+33456789012",
    },
    contactSecondaire: {
      prenom: "Claire",
      nom: "Petit",
      role: "Responsable administratif",
      email: "claire.petit@example.com",
      telephone: "+33856789012",
    },
    debutConvention: "2023-01-01T00:00:00.000Z",
    finConvention: "2026-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CAES Test",
    adresseAdministrative: {
      complete: "15 Boulevard de la Liberté 13001 Marseille",
      searchTerm: "15 boulevard liberte marseille",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    { placesAutorisees: 30, pmr: 3, lgbt: 4, fvvTeh: 5 },
    { placesAutorisees: 28, pmr: 3, lgbt: 4, fvvTeh: 5 },
    { placesAutorisees: 25, pmr: 2, lgbt: 3, fvvTeh: 4 },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
  finalisation: {
    finance: createSubventionneeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CAES sans CPOM finalisée avec succès",
  },
};

export const caesAvecCpom: TestStructureData = {
  ...caesSansCpom,
  cpom: true,
  identification: {
    ...caesSansCpom.identification,
    debutCpom: "2024-03-01T00:00:00.000Z",
    finCpom: "2029-02-28T00:00:00.000Z",
  },
  finalisation: {
    finance: createSubventionneeFinanceData(),
    typePlaces: {
      placesACreer: 0,
      placesAFermer: 0,
    },
    notes: "Structure CAES avec CPOM finalisée avec succès",
  },
};

// ===== COMPREHENSIVE TEST DATA - 15 SCENARIOS =====

// 1. CADA with CPOM, decimal budgets, young structure (<5 years)
export const cadaCpomDecimalYoung: TestStructureData = {
  dnaCode: "C9991",
  type: StructureType.CADA,
  cpom: true,
  identification: {
    filiale: "Filiale Jeune",
    operateur: {
      name: "Opérateur Jeune CADA",
      searchTerm: "Opér",
    },
    creationDate: "2022-03-15T00:00:00.000Z", // Less than 5 years old
    finessCode: "111222333",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Alice",
      nom: "Martin",
      role: "Directeur·rice",
      email: "alice.martin@jeune-cada.com",
      telephone: "+33123456789",
    },
    contactSecondaire: {
      prenom: "Bob",
      nom: "Dupont",
      role: "Responsable administratif",
      email: "bob.dupont@jeune-cada.com",
      telephone: "+33623456789",
    },
    debutPeriodeAutorisation: "2022-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2027-12-31T00:00:00.000Z",
    debutCpom: "2022-06-01T00:00:00.000Z",
    finCpom: "2027-05-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CADA Jeune Decimal",
    adresseAdministrative: {
      complete: "5 Rue des Jeunes 75010 Paris",
      searchTerm: "5 rue jeunes paris",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 26,
      pmr: 3,
      lgbt: 5,
      fvvTeh: 4,
    },
    {
      placesAutorisees: 24,
      pmr: 2,
      lgbt: 5,
      fvvTeh: 3,
    },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
};

// 2. CADA sans CPOM, missing optional fields (filiale, secondary contact)
export const cadaSansCpomMissingOptional: TestStructureData = {
  dnaCode: "C9992",
  type: StructureType.CADA,
  cpom: false,
  identification: {
    // No filiale
    operateur: {
      name: "Opérateur CADA Simple",
      searchTerm: "Opér",
    },
    creationDate: "2018-07-20T00:00:00.000Z",
    finessCode: "444555666",
    public: "Tout public",
    lgbt: false,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Claire",
      nom: "Bernard",
      role: "Directeur·rice",
      email: "claire.bernard@simple-cada.com",
      telephone: "+33234567890",
    },
    // No contactSecondaire
    debutPeriodeAutorisation: "2018-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2023-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CADA Simple",
    adresseAdministrative: {
      complete: "12 Avenue Simple 69001 Lyon",
      searchTerm: "12 avenue simple lyon",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 30,
      pmr: 3,
      lgbt: 0, // Edge case: 0 LGBT
      fvvTeh: 4,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 3. CPH with CPOM, Diffus addresses, decimal values
export const cphCpomDiffusDecimal: TestStructureData = {
  dnaCode: "R9993",
  type: StructureType.CPH,
  cpom: true,
  identification: {
    filiale: "Filiale CPH Diffus",
    operateur: {
      name: "Opérateur CPH Diffus",
      searchTerm: "Opér",
    },
    creationDate: "2019-11-10T00:00:00.000Z",
    finessCode: "777888999",
    public: "Famille",
    lgbt: true,
    fvvTeh: false,
    contactPrincipal: {
      prenom: "David",
      nom: "Moreau",
      role: "Directeur·rice",
      email: "david.moreau@cph-diffus.com",
      telephone: "+33345678901",
    },
    contactSecondaire: {
      prenom: "Emma",
      nom: "Leroy",
      role: "Responsable administratif",
      email: "emma.leroy@cph-diffus.com",
      telephone: "+33745678901",
    },
    debutPeriodeAutorisation: "2019-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2024-12-31T00:00:00.000Z",
    debutCpom: "2019-09-01T00:00:00.000Z",
    finCpom: "2024-08-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CPH Diffus Decimal",
    adresseAdministrative: {
      complete: "8 Rue Diffus 13001 Marseille",
      searchTerm: "8 rue diffus marseille",
    },
    typeBati: Repartition.DIFFUS,
    sameAddress: false,
    adresses: [
      {
        adresseComplete: "8 Rue Diffus 13001 Marseille",
        searchTerm: "8 rue diffus marseille",
        placesAutorisees: 16,
        repartition: Repartition.DIFFUS,
      },
      {
        adresseComplete: "15 Avenue Diffus 13002 Marseille",
        searchTerm: "15 avenue diffus marseille",
        placesAutorisees: 12,
        repartition: Repartition.DIFFUS,
      },
      {
        adresseComplete: "22 Boulevard Diffus 13003 Marseille",
        searchTerm: "22 boulevard diffus marseille",
        placesAutorisees: 8,
        repartition: Repartition.DIFFUS,
      },
    ],
  },
  typologies: [
    {
      placesAutorisees: 36,
      pmr: 4,
      lgbt: 6,
      fvvTeh: 3,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 4. CPH sans CPOM, Mixte addresses, famille public type
export const cphSansCpomMixteFamille: TestStructureData = {
  dnaCode: "R9994",
  type: StructureType.CPH,
  cpom: false,
  identification: {
    filiale: "Filiale CPH Mixte",
    operateur: {
      name: "Opérateur CPH Mixte",
      searchTerm: "Opér",
    },
    creationDate: "2017-05-12T00:00:00.000Z",
    finessCode: "123456789",
    public: "Famille",
    lgbt: false,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "François",
      nom: "Petit",
      role: "Directeur·rice",
      email: "francois.petit@cph-mixte.com",
      telephone: "+33456789012",
    },
    contactSecondaire: {
      prenom: "Gabrielle",
      nom: "Roux",
      role: "Responsable administratif",
      email: "gabrielle.roux@cph-mixte.com",
      telephone: "+33856789012",
    },
    debutPeriodeAutorisation: "2017-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2022-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CPH Mixte Famille",
    adresseAdministrative: {
      complete: "20 Rue Mixte 31000 Toulouse",
      searchTerm: "20 rue mixte toulouse",
    },
    typeBati: Repartition.MIXTE,
    sameAddress: false,
    adresses: [
      {
        adresseComplete: "20 Rue Mixte 31000 Toulouse",
        searchTerm: "20 rue mixte toulouse",
        placesAutorisees: 20,
        repartition: Repartition.COLLECTIF,
      },
      {
        adresseComplete: "25 Avenue Mixte 31001 Toulouse",
        searchTerm: "25 avenue mixte toulouse",
        placesAutorisees: 15,
        repartition: Repartition.DIFFUS,
      },
    ],
  },
  typologies: [
    {
      placesAutorisees: 35,
      pmr: 3,
      lgbt: 4,
      fvvTeh: 5,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 5. HUDA with CPOM, young structure, missing finessCode
export const hudaCpomYoungNoFiness: TestStructureData = {
  dnaCode: "H9995",
  type: StructureType.HUDA,
  cpom: true,
  identification: {
    // No filiale for HUDA
    operateur: {
      name: "Opérateur HUDA Jeune",
      searchTerm: "Opér",
    },
    creationDate: "2021-08-30T00:00:00.000Z", // Less than 5 years old
    // No finessCode
    public: "Personnes isolées",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Hélène",
      nom: "Simon",
      role: "Directeur·rice",
      email: "helene.simon@huda-jeune.com",
      telephone: "+33567890123",
    },
    contactSecondaire: {
      prenom: "Ivan",
      nom: "Michel",
      role: "Responsable administratif",
      email: "ivan.michel@huda-jeune.com",
      telephone: "+33967890123",
    },
    debutConvention: "2021-01-01T00:00:00.000Z",
    finConvention: "2024-12-31T00:00:00.000Z",
    debutCpom: "2021-10-01T00:00:00.000Z",
    finCpom: "2026-09-30T00:00:00.000Z",
  },
  adresses: {
    nom: "HUDA Jeune",
    adresseAdministrative: {
      complete: "30 Rue Jeune 67000 Strasbourg",
      searchTerm: "30 rue jeune strasbourg",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 40,
      pmr: 4,
      lgbt: 6,
      fvvTeh: 5,
    },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
};

// 6. HUDA sans CPOM, decimal places, personnes isolées
export const hudaSansCpomDecimalIsoles: TestStructureData = {
  dnaCode: "H9996",
  type: StructureType.HUDA,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur HUDA Decimal",
      searchTerm: "Opér",
    },
    creationDate: "2016-12-05T00:00:00.000Z",
    finessCode: "987654321",
    public: "Personnes isolées",
    lgbt: false,
    fvvTeh: false,
    contactPrincipal: {
      prenom: "Julien",
      nom: "Garcia",
      role: "Directeur·rice",
      email: "julien.garcia@huda-decimal.com",
      telephone: "+33678901234",
    },
    debutConvention: "2016-01-01T00:00:00.000Z",
    finConvention: "2021-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "HUDA Decimal Isolés",
    adresseAdministrative: {
      complete: "35 Avenue Decimal 44000 Nantes",
      searchTerm: "35 avenue decimal nantes",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 51,
      pmr: 5,
      lgbt: 0, // Edge case: 0 LGBT
      fvvTeh: 0, // Edge case: 0 FVV/TEH
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 7. CAES with CPOM, collectif, all optional fields filled
export const caesCpomCollectifComplete: TestStructureData = {
  dnaCode: "K9997",
  type: StructureType.CAES,
  cpom: true,
  identification: {
    filiale: "Filiale CAES Complete",
    operateur: {
      name: "Opérateur CAES Complete",
      searchTerm: "Opér",
    },
    creationDate: "2015-09-18T00:00:00.000Z",
    finessCode: "555666777",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Karine",
      nom: "Rodriguez",
      role: "Directeur·rice",
      email: "karine.rodriguez@caes-complete.com",
      telephone: "+33789012345",
    },
    contactSecondaire: {
      prenom: "Laurent",
      nom: "Lopez",
      role: "Responsable administratif",
      email: "laurent.lopez@caes-complete.com",
      telephone: "+33389012345",
    },
    debutConvention: "2015-01-01T00:00:00.000Z",
    finConvention: "2020-12-31T00:00:00.000Z",
    debutCpom: "2015-12-01T00:00:00.000Z",
    finCpom: "2020-11-30T00:00:00.000Z",
  },
  adresses: {
    nom: "CAES Complete",
    adresseAdministrative: {
      complete: "40 Rue Complete 59000 Lille",
      searchTerm: "40 rue complete lille",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 25,
      pmr: 2,
      lgbt: 3,
      fvvTeh: 4,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 8. CAES sans CPOM, edge values (0 LGBT, high places)
export const caesSansCpomEdgeValues: TestStructureData = {
  dnaCode: "K9998",
  type: StructureType.CAES,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur CAES Edge",
      searchTerm: "Opér",
    },
    creationDate: "2014-02-28T00:00:00.000Z",
    finessCode: "111333555",
    public: "Personnes isolées",
    lgbt: false,
    fvvTeh: false,
    contactPrincipal: {
      prenom: "Marc",
      nom: "Gonzalez",
      role: "Directeur·rice",
      email: "marc.gonzalez@caes-edge.com",
      telephone: "+33890123456",
    },
    debutConvention: "2014-01-01T00:00:00.000Z",
    finConvention: "2019-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "CAES Edge Values",
    adresseAdministrative: {
      complete: "45 Boulevard Edge 33000 Bordeaux",
      searchTerm: "45 boulevard edge bordeaux",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 100, // High number of places
      pmr: 10, // High PMR
      lgbt: 0, // Edge case: 0 LGBT
      fvvTeh: 0, // Edge case: 0 FVV/TEH
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 9. CADA missing required CPOM dates (should fail validation)
export const cadaMissingCpomDates: TestStructureData = {
  dnaCode: "C9999",
  type: StructureType.CADA,
  cpom: true,
  identification: {
    filiale: "Filiale CADA Invalid",
    operateur: {
      name: "Opérateur CADA Invalid",
      searchTerm: "Opér",
    },
    creationDate: "2020-04-15T00:00:00.000Z",
    finessCode: "999888777",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Nathalie",
      nom: "Fernandez",
      role: "Directeur·rice",
      email: "nathalie.fernandez@cada-invalid.com",
      telephone: "+33901234567",
    },
    contactSecondaire: {
      prenom: "Olivier",
      nom: "Perez",
      role: "Responsable administratif",
      email: "olivier.perez@cada-invalid.com",
      telephone: "+33401234567",
    },
    debutPeriodeAutorisation: "2020-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2025-12-31T00:00:00.000Z",
    // Missing debutCpom and finCpom - should cause validation error
  },
  adresses: {
    nom: "CADA Invalid CPOM",
    adresseAdministrative: {
      complete: "50 Rue Invalid 06000 Nice",
      searchTerm: "50 rue invalid nice",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 30,
      pmr: 3,
      lgbt: 4,
      fvvTeh: 3,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 10. Structure with decimal placesAutorisees
export const structureDecimalPlaces: TestStructureData = {
  dnaCode: "D0001",
  type: StructureType.CADA,
  cpom: false,
  identification: {
    filiale: "Filiale Decimal Places",
    operateur: {
      name: "Opérateur Decimal Places",
      searchTerm: "Opér",
    },
    creationDate: "2019-06-10T00:00:00.000Z",
    finessCode: "123987456",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Patricia",
      nom: "Sanchez",
      role: "Directeur·rice",
      email: "patricia.sanchez@decimal-places.com",
      telephone: "+33012345678",
    },
    debutPeriodeAutorisation: "2019-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2024-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Decimal Places",
    adresseAdministrative: {
      complete: "55 Avenue Decimal 35000 Rennes",
      searchTerm: "55 avenue decimal rennes",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 23,
      pmr: 2,
      lgbt: 4,
      fvvTeh: 2,
    },
    {
      placesAutorisees: 22,
      pmr: 2,
      lgbt: 3,
      fvvTeh: 2,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 11. Structure with multiple diffus addresses and varying typologies
export const structureMultipleDiffus: TestStructureData = {
  dnaCode: "D0002",
  type: StructureType.CPH,
  cpom: true,
  identification: {
    filiale: "Filiale Multiple Diffus",
    operateur: {
      name: "Opérateur Multiple Diffus",
      searchTerm: "Opér",
    },
    creationDate: "2018-11-25T00:00:00.000Z",
    finessCode: "456789123",
    public: "Famille",
    lgbt: true,
    fvvTeh: false,
    contactPrincipal: {
      prenom: "Quentin",
      nom: "Ramirez",
      role: "Directeur·rice",
      email: "quentin.ramirez@multiple-diffus.com",
      telephone: "+33112345678",
    },
    contactSecondaire: {
      prenom: "Rachel",
      nom: "Torres",
      role: "Responsable administratif",
      email: "rachel.torres@multiple-diffus.com",
      telephone: "+33612345678",
    },
    debutPeriodeAutorisation: "2018-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2023-12-31T00:00:00.000Z",
    debutCpom: "2018-12-01T00:00:00.000Z",
    finCpom: "2023-11-30T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Multiple Diffus",
    adresseAdministrative: {
      complete: "60 Rue Multiple 80000 Amiens",
      searchTerm: "60 rue multiple amiens",
    },
    typeBati: Repartition.DIFFUS,
    sameAddress: false,
    adresses: [
      {
        adresseComplete: "60 Rue Multiple 80000 Amiens",
        searchTerm: "60 rue multiple amiens",
        placesAutorisees: 8,
        repartition: Repartition.DIFFUS,
      },
      {
        adresseComplete: "65 Avenue Multiple 80001 Amiens",
        searchTerm: "65 avenue multiple amiens",
        placesAutorisees: 6,
        repartition: Repartition.DIFFUS,
      },
      {
        adresseComplete: "70 Boulevard Multiple 80002 Amiens",
        searchTerm: "70 boulevard multiple amiens",
        placesAutorisees: 4,
        repartition: Repartition.DIFFUS,
      },
      {
        adresseComplete: "75 Place Multiple 80003 Amiens",
        searchTerm: "75 place multiple amiens",
        placesAutorisees: 3,
        repartition: Repartition.DIFFUS,
      },
    ],
  },
  typologies: [
    {
      placesAutorisees: 21, // Sum of all addresses
      pmr: 2,
      lgbt: 3,
      fvvTeh: 1,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 12. Structure with mock document uploads (different categories/years)
export const structureWithMockDocuments: TestStructureData = {
  dnaCode: "D0003",
  type: StructureType.CADA,
  cpom: true,
  identification: {
    filiale: "Filiale Documents",
    operateur: {
      name: "Opérateur Documents",
      searchTerm: "Opér",
    },
    creationDate: "2020-01-15T00:00:00.000Z",
    finessCode: "789123456",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Stéphane",
      nom: "Flores",
      role: "Directeur·rice",
      email: "stephane.flores@documents.com",
      telephone: "+33212345678",
    },
    contactSecondaire: {
      prenom: "Tatiana",
      nom: "Rivera",
      role: "Responsable administratif",
      email: "tatiana.rivera@documents.com",
      telephone: "+33712345678",
    },
    debutPeriodeAutorisation: "2020-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2025-12-31T00:00:00.000Z",
    debutCpom: "2020-06-01T00:00:00.000Z",
    finCpom: "2025-05-31T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Documents",
    adresseAdministrative: {
      complete: "80 Rue Documents 72000 Le Mans",
      searchTerm: "80 rue documents le mans",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 35,
      pmr: 3,
      lgbt: 5,
      fvvTeh: 4,
    },
  ],
  documents: {
    less5Years: false,
    files: [
      {
        year: "2023",
        category: "BUDGET_PREVISIONNEL_DEMANDE",
        fileName: "budget-previsionnel-2023.pdf",
        filePath: "/mock/budget-previsionnel-2023.pdf",
      },
      {
        year: "2023",
        category: "RAPPORT_ACTIVITE",
        fileName: "rapport-activite-2023.pdf",
        filePath: "/mock/rapport-activite-2023.pdf",
      },
      {
        year: "2022",
        category: "COMPTE_ADMINISTRATIF_SOUMIS",
        fileName: "compte-admin-2022.xlsx",
        filePath: "/mock/compte-admin-2022.xlsx",
      },
    ],
  },
};

// 13. Young structure with budget data
export const youngStructureWithBudget: TestStructureData = {
  dnaCode: "D0004",
  type: StructureType.HUDA,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur Jeune Budget",
      searchTerm: "Opér",
    },
    creationDate: "2023-03-20T00:00:00.000Z", // Very young structure
    finessCode: "321654987",
    public: "Personnes isolées",
    lgbt: false,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Ursula",
      nom: "Cruz",
      role: "Directeur·rice",
      email: "ursula.cruz@jeune-budget.com",
      telephone: "+33312345678",
    },
    debutConvention: "2023-01-01T00:00:00.000Z",
    finConvention: "2026-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Jeune Budget",
    adresseAdministrative: {
      complete: "90 Avenue Jeune 10000 Troyes",
      searchTerm: "90 avenue jeune troyes",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 20,
      pmr: 2,
      lgbt: 0,
      fvvTeh: 3,
    },
  ],
  documents: {
    less5Years: true,
    files: [],
  },
};

// 14. Structure with affectationReserves validation case
export const structureAffectationReserves: TestStructureData = {
  dnaCode: "D0005",
  type: StructureType.CADA,
  cpom: true,
  identification: {
    filiale: "Filiale Réserves",
    operateur: {
      name: "Opérateur Réserves",
      searchTerm: "Opér",
    },
    creationDate: "2017-08-12T00:00:00.000Z",
    finessCode: "654321987",
    public: "Tout public",
    lgbt: true,
    fvvTeh: true,
    contactPrincipal: {
      prenom: "Victor",
      nom: "Ortiz",
      role: "Directeur·rice",
      email: "victor.ortiz@reserves.com",
      telephone: "+33412345678",
    },
    contactSecondaire: {
      prenom: "Wendy",
      nom: "Gomez",
      role: "Responsable administratif",
      email: "wendy.gomez@reserves.com",
      telephone: "+33912345678",
    },
    debutPeriodeAutorisation: "2017-01-01T00:00:00.000Z",
    finPeriodeAutorisation: "2022-12-31T00:00:00.000Z",
    debutCpom: "2017-10-01T00:00:00.000Z",
    finCpom: "2022-09-30T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Réserves",
    adresseAdministrative: {
      complete: "100 Rue Réserves 14000 Caen",
      searchTerm: "100 rue reserves caen",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 40,
      pmr: 4,
      lgbt: 6,
      fvvTeh: 5,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};

// 15. Structure with missing required contact (should fail)
export const structureMissingRequiredContact: TestStructureData = {
  dnaCode: "D0006",
  type: StructureType.CAES,
  cpom: false,
  identification: {
    operateur: {
      name: "Opérateur Contact Manquant",
      searchTerm: "Opér",
    },
    creationDate: "2016-05-08T00:00:00.000Z",
    finessCode: "987654321",
    public: "Personnes isolées",
    lgbt: false,
    fvvTeh: false,
    // Missing contactPrincipal - should cause validation error
    debutConvention: "2016-01-01T00:00:00.000Z",
    finConvention: "2021-12-31T00:00:00.000Z",
  },
  adresses: {
    nom: "Structure Contact Manquant",
    adresseAdministrative: {
      complete: "110 Boulevard Contact 25000 Besançon",
      searchTerm: "110 boulevard contact besancon",
    },
    typeBati: Repartition.COLLECTIF,
    sameAddress: true,
  },
  typologies: [
    {
      placesAutorisees: 15,
      pmr: 1,
      lgbt: 0,
      fvvTeh: 0,
    },
  ],
  documents: {
    less5Years: false,
    files: [],
  },
};
