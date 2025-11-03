import { AdresseApiType } from "@/schemas/api/adresse.schema";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { CodeDnaType } from "@/types/codeDna.type";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

export const createStructure = ({
  adresseAdministrative = "1, avenue de la République",
  adresses,
  type = StructureType.CADA,
  finessCode,
  publicType,
  cpom = false,
  structureTypologies,
}: CreateStructuresArgs): StructureApiType => {
  return {
    id: 1,
    operateur: { structureId: 1, name: "Adoma" },
    codesDna: [
      {
        code: "C0001",
        type: CodeDnaType.PRINCIPAL,
        adresseAdministrative: "1, avenue de la République",
        codePostalAdministratif: "75011",
        communeAdministrative: "Paris",
        departementAdministratif: "75",
        creationDate: new Date("01/02/2007").toISOString(),
        latitude: 48.8670239.toString(),
        longitude: 2.3612011.toString(),
      },
    ],
    filiale: undefined,
    type,
    adresseAdministrative,
    codePostalAdministratif: "75011",
    communeAdministrative: "Paris",
    departementAdministratif: "75",
    cpom,
    creationDate: new Date("01/02/2007").toISOString(),
    finessCode,
    lgbt: true,
    fvvTeh: false,
    public: publicType ?? ("TOUT_PUBLIC" as PublicType),
    debutPeriodeAutorisation: new Date("01/02/2022").toISOString(),
    finPeriodeAutorisation: new Date("01/02/2025").toISOString(),
    debutCpom: new Date("01/02/2026").toISOString(),
    finCpom: new Date("01/02/2028").toISOString(),
    debutConvention: new Date("2024-01-02").toISOString(),
    finConvention: new Date("2027-01-02").toISOString(),
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
