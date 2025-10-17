import { Repartition } from "@/types/adresse.type";
import { ContactType } from "@/types/contact.type";

import { UpdateForm } from "../forms/form.types";

export type CreateStructure = {
  dnaCode: string;
  operateur: CreateOperateur;
  filiale?: string;
  type: string;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  nom?: string;
  debutConvention?: Date | null;
  finConvention?: Date | null;
  cpom: boolean;
  creationDate: Date;
  finessCode?: string;
  lgbt: boolean;
  fvvTeh: boolean;
  public: string;
  debutPeriodeAutorisation?: Date | null;
  finPeriodeAutorisation?: Date | null;
  debutCpom?: Date | null;
  finCpom?: Date | null;
  adresses: CreateAdresse[];
  contacts: CreateContact[];
  typologies: CreateStructureTypologie[];
  fileUploads: CreateFileUpload[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateAdresse = {
  adresse: string;
  codePostal: string;
  commune: string;
  repartition: string;
  adresseTypologies: CreateAdresseTypologie[];
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateFileUpload = {
  key: string;
  date: Date;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateContact = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  role: string;
  type?: ContactType;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateStructureTypologie = {
  date: Date;
  placesAutorisees: number;
  pmr: number;
  lgbt: number;
  fvvTeh: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateAdresseTypologie = {
  placesAutorisees: number;
  date: Date;
  qpv: number;
  logementSocial: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateBudget = {
  date: Date;
  ETP?: number;
  tauxEncadrement?: number;
  coutJournalier?: number;
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
  reportANouveau?: number | null;
  autre?: number | null;
  commentaire?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateOperateur = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
};
export type UpdateControle = {
  date?: Date;
  type: string;
  fileUploadKey: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateEvaluation = {
  id?: number;
  date: Date;
  notePersonne?: number;
  notePro?: number;
  noteStructure?: number;
  note?: number;
  fileUploads?: UpdateFileUpload[];
};

export type UpdateFileUpload = {
  key: string;
  category: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  id?: number;
  categoryName?: string | null;
  parentFileUploadId?: number | null;
  controleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type UpdateAdresseTypologie = CreateAdresseTypologie & { id?: number };
export type UpdateAdresse = Omit<CreateAdresse, "adresseTypologies"> & {
  id?: number;
  adresseTypologies: UpdateAdresseTypologie[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateStructure = {
  dnaCode: string;
  operateur?: UpdateOperateur;
  filiale?: string;
  type?: string;
  adresseAdministrative?: string;
  codePostalAdministratif?: string;
  communeAdministrative?: string;
  departementAdministratif?: string;
  typeBati?: Repartition;
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
  evaluations?: UpdateEvaluation[];
  adresses?: UpdateAdresse[];
  contacts?: UpdateContact[];
  typologies?: UpdateStructureTypologie[];
  fileUploads?: UpdateFileUpload[];
  budgets?: UpdateBudget[];
  forms?: UpdateForm[];
  createdAt?: Date;
  updatedAt?: Date;
};