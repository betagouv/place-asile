export type CreateStructure = {
  dnaCode: string;
  operateur: string;
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

type CreateAdresseTypologie = {
  nbPlacesTotal: number;
  date: Date;
  qpv: number;
  logementSocial: number;
};
