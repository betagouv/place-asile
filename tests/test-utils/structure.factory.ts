import { LatLngTuple } from "leaflet";

import { Adresse } from "@/types/adresse.type";
import {
  PublicType,
  Structure,
  StructureState,
  StructureType,
} from "@/types/structure.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

export const createStructure = ({
  adresseAdministrative,
  adresses,
  type,
  finessCode,
  publicType,
  state,
  cpom,
  structureTypologies,
}: CreateStructuresArgs): Structure => {
  return {
    id: 1,
    dnaCode: "C0001",
    operateur: { structureDnaCode: "C0001", id: 1, name: "Adoma" },
    filiale: null,
    type: type ?? StructureType.CADA,
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
    structureTypologies: structureTypologies ?? []
  };
};

type CreateStructuresArgs = {
  adresseAdministrative?: string;
  structureTypologies?: StructureTypologie[]
  adresses?: Adresse[];
  type?: StructureType;
  finessCode?: string;
  publicType?: PublicType;
  state?: StructureState;
  cpom?: boolean;
};
