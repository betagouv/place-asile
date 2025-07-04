export type CreateStructure = {
  dnaCode: string;
  operateur: string;
  filiale?: string;
  type: string;
  nbPlaces: number;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  nom?: string;
  debutConvention?: Date;
  finConvention?: Date;
  cpom: boolean;
  creationDate: Date;
  finessCode?: string;
  lgbt: boolean;
  fvvTeh: boolean;
  public: string;
  debutPeriodeAutorisation?: Date;
  finPeriodeAutorisation?: Date;
  debutCpom?: Date;
  finCpom?: Date;
  adresses: CreateAdresse[];
  contacts: CreateContact[];
  typologies: CreateStructureTypologie[];
  fileUploads: CreateFileUpload[];
};

export type CreateAdresse = {
  adresse: string;
  codePostal: string;
  commune: string;
  repartition: string;
  typologies: CreateAdresseTypologie[];
};

type CreateFileUpload = {
  key: string;
  date: Date;
  category: string;
};

type CreateContact = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  role: string;
};

type CreateStructureTypologie = {
  date: Date;
  pmr: number;
  lgbt: number;
  fvvTeh: number;
};

export type CreateAdresseTypologie = {
  nbPlacesTotal: number;
  date: Date;
  qpv: number;
  logementSocial: number;
};

type CreateBudget = {
  date: Date;
  ETP: number;
  tauxEncadrement: number;
  coutJournalier: number;
  dotationDemandee: number;
  dotationAccordee?: number | null;
  totalProduits?: number;
  totalCharges?: number;
  cumulResultatsNetsCPOM?: number;
  repriseEtat?: number;
  reserveInvestissement?: number;
  chargesNonReconductibles?: number;
  reserveCompensationDeficits?: number;
  reserveCompensationBFR?: number;
  reserveCompensationAmortissements?: number;
  fondsDedies?: number;
  affectationReservesFondsDedies?: number;
  commentaire?: string;
};

type CreateControle = {
  date: Date;
  type: string;
  fileUploads: CreateFileUpload[];
};

export type UpdateContact = CreateContact & { id?: number };
export type UpdateBudget = CreateBudget & { id?: number };
export type UpdateStructureTypologie = CreateStructureTypologie & {
  id?: number;
};
export type UpdateControle = CreateControle & {
  id?: number;
};
export type UpdateFileUpload = CreateFileUpload & {
  startDate?: Date;
  endDate?: Date;
  id?: number;
};
type UpdateAdresseTypologie = CreateAdresseTypologie & { id?: number };
export type UpdateAdresse = CreateAdresse & {
  id?: number;
  typologies: UpdateAdresseTypologie[];
};

export type UpdateStructure = {
  dnaCode: string;
  operateur?: string;
  filiale?: string;
  type?: string;
  nbPlaces?: number;
  adresseAdministrative?: string;
  codePostalAdministratif?: string;
  communeAdministrative?: string;
  departementAdministratif?: string;
  nom?: string;
  debutConvention?: Date;
  finConvention?: Date;
  cpom?: boolean;
  creationDate?: Date;
  finessCode?: string;
  lgbt?: boolean;
  fvvTeh?: boolean;
  public?: string;
  debutPeriodeAutorisation?: Date;
  finPeriodeAutorisation?: Date;
  debutCpom?: Date;
  finCpom?: Date;
  placesACreer?: number;
  placesAFermer?: number;
  echeancePlacesACreer?: Date;
  echeancePlacesAFermer?: Date;
  controles?: UpdateControle[];
  adresses?: UpdateAdresse[];
  contacts?: UpdateContact[];
  typologies?: UpdateStructureTypologie[];
  fileUploads?: UpdateFileUpload[];
  budgets?: UpdateBudget[];
};
