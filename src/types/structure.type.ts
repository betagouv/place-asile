import { LatLngTuple } from "leaflet";

export type Structure = {
  id: number;
  operateur: string;
  type: string;
  nbPlaces: number;
  adresseHebergement: string;
  codePostalHebergement: string;
  communeHebergement: string;
  nbHebergements: number;
  typologie: string;
  coordinates: LatLngTuple;
  adresseOperateur: string;
};

export type StructureWithLatLng = Structure & {
  latitude: number;
  longitude: number;
};

export type StructureAdministrative = {
  id: number;
  adresseOperateur: string;
  operateur: string;
  type: string;
  typologie: string;
  coordinates: LatLngTuple;
  attachedStructures: StructureWithLatLng[];
};
