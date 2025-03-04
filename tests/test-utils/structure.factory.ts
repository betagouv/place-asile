import { StructureWithLatLng } from "@/types/structure.type";
import { LatLngTuple } from "leaflet";

export const createStructures = ({
  adresseOperateur,
  nbPlaces,
}: CreateStructuresArgs): StructureWithLatLng[] => {
  return [
    {
      operateur: "Adoma",
      type: "CADA",
      nbPlaces: nbPlaces ?? 5,
      adresseHebergement: "1, avenue de la République",
      adresseOperateur:
        adresseOperateur ?? "123, avenue de la République, 75011 Paris",
      codePostalHebergement: "75011",
      communeHebergement: "Paris",
      nbHebergements: 1,
      typologie: "Diffus",
      coordinates: [48.8670239, 2.3612011] as LatLngTuple,
      id: 1,
      latitude: 0,
      longitude: 0,
    },
    {
      operateur: "Adoma",
      type: "CAES",
      nbPlaces: nbPlaces ?? 3,
      adresseHebergement: "2, avenue de la République",
      adresseOperateur:
        adresseOperateur ?? "123, avenue de la République, 75011 Paris",
      codePostalHebergement: "75011",
      communeHebergement: "Paris",
      nbHebergements: 2,
      typologie: "Collectif",
      coordinates: [48.8670239, 2.3612011] as LatLngTuple,
      id: 2,
      latitude: 0,
      longitude: 0,
    },
    {
      operateur: "CDS",
      type: "HUDA",
      nbPlaces: nbPlaces ?? 2,
      adresseHebergement: "3, avenue de la République",
      adresseOperateur:
        adresseOperateur ?? "123, avenue de la République, 75011 Paris",
      codePostalHebergement: "75011",
      communeHebergement: "Paris",
      nbHebergements: 2,
      typologie: "Collectif",
      coordinates: [48.8670239, 2.3612011] as LatLngTuple,
      id: 3,
      latitude: 0,
      longitude: 0,
    },
  ];
};

type CreateStructuresArgs = {
  adresseOperateur?: string;
  nbPlaces?: number;
};
