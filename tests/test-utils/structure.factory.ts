import { Repartition, Structure } from "@/types/structure.type";
import { LatLngTuple } from "leaflet";

export const createStructure = ({
  adresse,
  nbPlaces,
}: CreateStructuresArgs): Structure => {
  return {
    id: 1,
    dnaCode: "C0001",
    operateur: "Adoma",
    type: "CADA",
    nbPlaces: nbPlaces ?? 5,
    adresse: adresse ?? "1, avenue de la République",
    codePostal: "75011",
    commune: "Paris",
    departement: "75",
    repartition: Repartition.DIFFUS,
    coordinates: [48.8670239, 2.3612011] as LatLngTuple,
    latitude: 0,
    longitude: 0,
    nom: "Les Mimosas",
    debutConvention: new Date("01/02/2024"),
    finConvention: new Date("01/02/2027"),
    qpv: true,
    cpom: true,
    creationDate: new Date("01/02/2007"),
    finessCode: "F12345",
    lgbt: true,
    fvvTeh: false,
    public: "Tout public",
    periodeAutorisationStart: new Date("01/02/2022"),
    periodeAutorisationEnd: new Date("01/02/2025"),
    cpomStart: new Date("01/02/2025"),
    cpomEnd: new Date("01/02/2025"),
  };
};

type CreateStructuresArgs = {
  adresse?: string;
  nbPlaces?: number;
};
