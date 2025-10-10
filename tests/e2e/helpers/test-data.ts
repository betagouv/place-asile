import { Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

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
    contactPrincipal: {
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
    creationDate: "2015-06-01",
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
    debutPeriodeAutorisation: "2020-01-01",
    finPeriodeAutorisation: "2025-12-31",
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
};

export const cadaAvecCpom: TestStructureData = {
  ...cadaSansCpom,
  cpom: true,
  identification: {
    ...cadaSansCpom.identification,
    debutCpom: "2023-01-01",
    finCpom: "2027-12-31",
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
    creationDate: "2016-03-15",
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
    debutPeriodeAutorisation: "2021-01-01",
    finPeriodeAutorisation: "2026-12-31",
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
};

export const cphAvecCpom: TestStructureData = {
  ...cphSansCpom,
  cpom: true,
  identification: {
    ...cphSansCpom.identification,
    debutCpom: "2023-06-01",
    finCpom: "2028-05-31",
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
    creationDate: "2017-09-01",
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
    debutConvention: "2022-01-01",
    finConvention: "2025-12-31",
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
};

export const hudaAvecCpom: TestStructureData = {
  ...hudaSansCpom,
  cpom: true,
  identification: {
    ...hudaSansCpom.identification,
    debutCpom: "2024-01-01",
    finCpom: "2028-12-31",
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
    creationDate: "2018-04-20",
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
    debutConvention: "2023-01-01",
    finConvention: "2026-12-31",
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
};

export const caesAvecCpom: TestStructureData = {
  ...caesSansCpom,
  cpom: true,
  identification: {
    ...caesSansCpom.identification,
    debutCpom: "2024-03-01",
    finCpom: "2029-02-28",
  },
};
