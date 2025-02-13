import { LatLngTuple } from "leaflet";

export type Centre = {
  operateur: string;
  type: string;
  nbPlaces: number;
  adresseHebergement: string;
  codePostalHebergement: string;
  communeHebergement: string;
  nbHebergements: number;
  typologie: string;
  coordinates: LatLngTuple;
};
