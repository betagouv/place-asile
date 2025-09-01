export type CreateStructure = {
  dnaCode: string;
  operateur: CreateOperateur;
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
  placesAutorisees: number;
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
  dotationDemandee?: number | null;
  dotationAccordee?: number | null;
  totalProduits?: number | null;
  totalCharges?: number | null;
  totalChargesProposees?: number | null;
  cumulResultatsNetsCPOM?: number | null;
  repriseEtat?: number | null;
  excedentRecupere?: number | null;
  excedentDeduit?: number | null;
  reserveInvestissement?: number | null;
  chargesNonReconductibles?: number | null;
  reserveCompensationDeficits?: number | null;
  reserveCompensationBFR?: number | null;
  reserveCompensationAmortissements?: number | null;
  fondsDedies?: number | null;
  affectationReservesFondsDedies?: number | null;
  commentaire?: string | null;
};

type CreateOperateur = {
  id: number;
  name: string;
};

export type UpdateOperateur = CreateOperateur;

export type UpdateContact = CreateContact & { id?: number };
export type UpdateBudget = CreateBudget & { id?: number };
export type UpdateStructureTypologie = {
  id?: number;
  placesAutorisees: number;
  pmr: number;
  lgbt: number;
  fvvTeh: number;
};
export type UpdateControle = {
  date: Date;
  type: string;
  fileUploadKey: string;
  id?: number;
};
export type UpdateFileUpload = {
  key: string;
  category: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  id?: number;
  categoryName?: string;
};
type UpdateAdresseTypologie = CreateAdresseTypologie & { id?: number };
export type UpdateAdresse = CreateAdresse & {
  id?: number;
  typologies: UpdateAdresseTypologie[];
};

export type UpdateStructure = {
  dnaCode: string;
  operateur?: UpdateOperateur;
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
  notes?: string | null;
  controles?: UpdateControle[];
  adresses?: UpdateAdresse[];
  contacts?: UpdateContact[];
  typologies?: UpdateStructureTypologie[];
  fileUploads?: UpdateFileUpload[];
  budgets?: UpdateBudget[];
};
