import { LatLngTuple } from "leaflet";
import { Controle } from "./controle.type";
import { Evaluation } from "./evaluation.type";
import { EvenementIndesirableGrave } from "./evenementIndesirableGrave.type";
import { Adresse } from "./adresse.type";
import { Contact } from "./contact.type";
import { StructureTypologie } from "./structure-typologie.type";
import { Activite } from "./activite.type";

export type Structure = {
  id: number;
  dnaCode: string;
  operateur: string;
  type: StructureType;
  nbPlaces: number;
  placesACreer?: number;
  placesAFermer?: number;
  echeancePlacesACreer?: Date;
  echeancePlacesAFermer?: Date;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  latitude: number;
  longitude: number;
  nom: string | null;
  debutConvention: Date | null;
  finConvention: Date | null;
  cpom: boolean;
  creationDate: Date;
  finessCode: string | null;
  lgbt: boolean;
  fvvTeh: boolean;
  public: PublicType;
  debutPeriodeAutorisation: Date | null;
  finPeriodeAutorisation: Date | null;
  debutCpom: Date | null;
  finCpom: Date | null;
  coordinates: LatLngTuple;
  notes: string;
  controles?: Controle[];
  evaluations?: Evaluation[];
  evenementsIndesirablesGraves?: EvenementIndesirableGrave[];
  adresses?: Adresse[];
  contacts?: Contact[];
  typologies?: StructureTypologie[];
  activites?: Activite[];
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
