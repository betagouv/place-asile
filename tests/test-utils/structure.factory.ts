import { AdresseApiType } from "@/schemas/api/adresse.schema";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

export const createStructure = ({
  adresseAdministrative,
  adresses,
  type,
  finessCode,
  publicType,
  cpom,
  structureTypologies,
}: CreateStructuresArgs): StructureApiType => {
  return {
    id: 1,
    dnaCode: "C0001",
    operateur: { structureDnaCode: "C0001", id: 1, name: "Adoma" },
    filiale: undefined,
    type: type ?? StructureType.CADA,
    placesACreer: 3,
    placesAFermer: 2,
    echeancePlacesACreer: new Date("01/02/2026").toISOString(),
    echeancePlacesAFermer: new Date("01/02/2027").toISOString(),
    adresseAdministrative:
      adresseAdministrative ?? "1, avenue de la République",
    codePostalAdministratif: "75011",
    communeAdministrative: "Paris",
    departementAdministratif: "75",
    latitude: "48.8670239",
    longitude: "2.3612011",
    nom: "Les Mimosas",
    debutConvention: new Date("01/02/2024").toISOString(),
    finConvention: new Date("01/02/2027").toISOString(),
    cpom: cpom ?? true,
    creationDate: new Date("01/02/2007").toISOString(),
    finessCode: finessCode ?? "123456789",
    lgbt: true,
    fvvTeh: false,
    public: publicType ?? ("TOUT_PUBLIC" as PublicType),
    debutPeriodeAutorisation: new Date("01/02/2022").toISOString(),
    finPeriodeAutorisation: new Date("01/02/2025").toISOString(),
    debutCpom: new Date("01/02/2026").toISOString(),
    finCpom: new Date("01/02/2028").toISOString(),
    adresses: adresses ?? [],
    notes: "Note 1",
    structureTypologies: structureTypologies ?? [],
    forms: [],
    contacts: [],
    documentsFinanciers: [],
  };
};

type CreateStructuresArgs = {
  adresseAdministrative?: string;
  structureTypologies?: StructureTypologieApiType[];
  adresses?: AdresseApiType[];
  type?: StructureType;
  finessCode?: string;
  publicType?: PublicType;
  state?: StructureState;
  cpom?: boolean;
};
