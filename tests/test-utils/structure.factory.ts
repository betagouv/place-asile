import { Adresse } from "@/types/adresse.type";
import { PublicType, Structure, StructureType } from "@/types/structure.type";
import { LatLngTuple } from "leaflet";

export const createStructure = ({
  adresseAdministrative,
  nbPlaces,
  adresses,
}: CreateStructuresArgs): Structure => {
  return {
    id: 1,
    dnaCode: "C0001",
    operateur: "Adoma",
    type: StructureType.CADA,
    nbPlaces: nbPlaces ?? 5,
    adresseAdministrative:
      adresseAdministrative ?? "1, avenue de la République",
    codePostalAdministratif: "75011",
    communeAdministrative: "Paris",
    departementAdministratif: "75",
    coordinates: [48.8670239, 2.3612011] as LatLngTuple,
    latitude: 0,
    longitude: 0,
    nom: "Les Mimosas",
    debutConvention: new Date("01/02/2024"),
    finConvention: new Date("01/02/2027"),
    cpom: true,
    creationDate: new Date("01/02/2007"),
    finessCode: "F12345",
    lgbt: true,
    fvvTeh: false,
    public: PublicType.TOUT_PUBLIC,
    debutPeriodeAutorisation: new Date("01/02/2022"),
    finPeriodeAutorisation: new Date("01/02/2025"),
    debutCpom: new Date("01/02/2025"),
    finCpom: new Date("01/02/2025"),
    adresses: adresses ?? [],
  };
};

type CreateStructuresArgs = {
  adresseAdministrative?: string;
  nbPlaces?: number;
  adresses?: Adresse[];
};
