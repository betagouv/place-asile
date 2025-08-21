import { Adresse } from "@/types/adresse.type";
import {
  PublicType,
  Structure,
  StructureState,
  StructureType,
} from "@/types/structure.type";
import { LatLngTuple } from "leaflet";

export const createStructure = ({
  adresseAdministrative,
  nbPlaces,
  adresses,
  type,
  finessCode,
  publicType,
  state,
  cpom,
}: CreateStructuresArgs): Structure => {
  return {
    id: 1,
    dnaCode: "C0001",
    operateur: "Adoma",
    filiale: null,
    type: type ?? StructureType.CADA,
    nbPlaces: nbPlaces ?? 5,
    placesACreer: 3,
    placesAFermer: 2,
    echeancePlacesACreer: new Date("01/02/2026"),
    echeancePlacesAFermer: new Date("01/02/2027"),
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
    cpom: cpom ?? true,
    creationDate: new Date("01/02/2007"),
    finessCode: finessCode ?? "123456789",
    lgbt: true,
    fvvTeh: false,
    public: publicType ?? ("TOUT_PUBLIC" as PublicType),
    debutPeriodeAutorisation: new Date("01/02/2022"),
    finPeriodeAutorisation: new Date("01/02/2025"),
    debutCpom: new Date("01/02/2026"),
    finCpom: new Date("01/02/2028"),
    adresses: adresses ?? [],
    notes: "Note 1",
    state: state ?? StructureState.A_FINALISER,
  };
};

type CreateStructuresArgs = {
  adresseAdministrative?: string;
  nbPlaces?: number;
  adresses?: Adresse[];
  type?: StructureType;
  finessCode?: string;
  publicType?: PublicType;
  state?: StructureState;
  cpom?: boolean;
};
