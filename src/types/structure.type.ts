import { LatLngTuple } from "leaflet";
import { Controle } from "./controle.type";
import { Evaluation } from "./evaluation.type";
import { EvenementIndesirableGrave } from "./evenementIndesirableGrave.type";
import { Logement } from "./logement.type";
import { Place } from "./place.type";

export type Structure = {
  id: number;
  dnaCode: string;
  operateur: string;
  type: string;
  nbPlaces: number;
  adresse: string;
  codePostal: string;
  commune: string;
  departement: string;
  latitude: number;
  longitude: number;
  repartition: string;
  nom: string | null;
  debutConvention: Date;
  finConvention: Date;
  qpv: boolean;
  cpom: boolean;
  creationDate: Date;
  finessCode: string;
  lgbt: boolean;
  fvv: boolean;
  teh: boolean;
  public: string;
  periodeAutorisationStart: Date;
  periodeAutorisationEnd: Date;
  cpomStart: Date;
  cpomEnd: Date;
  nbPlacesLibres: number;
  nbPlacesVacantes: number;
  coordinates: LatLngTuple;
  controles?: Controle[];
  evaluations?: Evaluation[];
  evenementsIndesirablesGraves?: EvenementIndesirableGrave[];
  logements?: Logement[];
  places?: Place[];
};

export type StructureWithLatLng = Structure & {
  latitude: number;
  longitude: number;
};
