import { LatLngTuple } from "leaflet";
import { Controle } from "./controle.type";
import { Evaluation } from "./evaluation.type";
import { EvenementIndesirableGrave } from "./evenementIndesirableGrave.type";
import { Adresse } from "./adresse.type";
import { Contact } from "./contact.type";
import { Pmr } from "./pmr.type";

export type Structure = {
  id: number;
  dnaCode: string;
  operateur: string;
  type: StructureType;
  nbPlaces: number;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  latitude: number;
  longitude: number;
  nom: string | null;
  debutConvention: Date;
  finConvention: Date;
  cpom: boolean;
  creationDate: Date;
  finessCode: string;
  lgbt: boolean;
  fvvTeh: boolean;
  public: PublicType;
  periodeAutorisationStart: Date;
  periodeAutorisationEnd: Date;
  cpomStart: Date;
  cpomEnd: Date;
  coordinates: LatLngTuple;
  controles?: Controle[];
  evaluations?: Evaluation[];
  evenementsIndesirablesGraves?: EvenementIndesirableGrave[];
  adresses?: Adresse[];
  contacts?: Contact[];
  pmrs?: Pmr[];
};

export type StructureWithLatLng = Structure & {
  latitude: number;
  longitude: number;
};

export enum PublicType {
  TOUT_PUBLIC = "Tout public",
  FAMILLE = "Famille",
  PERSONNES_ISOLEES = "Personnes isolées",
}

export enum StructureType {
  CADA = "CADA",
  HUDA = "HUDA",
  CPH = "CPH",
  CAES = "CAES",
  PRAHDA = "PRAHDA",
}
