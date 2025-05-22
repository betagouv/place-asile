import { LatLngTuple } from "leaflet";
import { Controle } from "./controle.type";
import { Evaluation } from "./evaluation.type";
import { EvenementIndesirableGrave } from "./evenement-indesirable-grave.type";
import { Adresse } from "./adresse.type";
import { Contact } from "./contact.type";
import { StructureTypologie } from "./structure-typologie.type";
import { Activite } from "./activite.type";
import { FileUpload } from "./file-upload.type";

export type Structure = {
  id: number;
  dnaCode: string;
  operateur: string;
  filiale: string | null;
  type: StructureType;
  nbPlaces: number;
  placesACreer: number | null;
  placesAFermer: number | null;
  echeancePlacesACreer: Date | null;
  echeancePlacesAFermer: Date | null;
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
  notes: string | null;
  controles?: Controle[];
  evaluations?: Evaluation[];
  evenementsIndesirablesGraves?: EvenementIndesirableGrave[];
  adresses?: Adresse[];
  contacts?: Contact[];
  typologies?: StructureTypologie[];
  activites?: Activite[];
  fileUploads?: FileUpload[];
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
