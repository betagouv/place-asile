import { LatLngTuple } from "leaflet";

export type Structure = {
  operateur: string;
  type: string;
  nbPlaces: number;
  adresseHebergement: string;
  codePostalHebergement: string;
  communeHebergement: string;
  nbHebergements: number;
  typologie: string;
  coordinates: LatLngTuple;
  id: number;
};

export type StructureWithCoordinates = Structure & {
  latitude: number;
  longitude: number;
};
