import xlsx from "node-xlsx";
import {
  Adresse,
  Repartition,
  Structure,
  Contact,
  PublicType,
  Typologie,
} from "@prisma/client";

const convertToBoolean = (value: string): boolean => {
  return value === "Oui";
};

const convertToRepartition = (repartition: string): Repartition => {
  const repartitions: Record<string, Repartition> = {
    Diffus: Repartition.DIFFUS,
    Collectif: Repartition.COLLECTIF,
    Mixte: Repartition.MIXTE,
  };
  return repartitions[repartition];
};

const convertToPublicType = (typePublic: string): PublicType => {
  const typesPublic: Record<string, PublicType> = {
    "Tout public": PublicType.TOUT_PUBLIC,
    Famille: PublicType.FAMILLE,
    "Personnes isolées": PublicType.PERSONNES_ISOLEES,
  };
  return typesPublic[typePublic];
};

const getSheet = (sheetIndex: number) => {
  const sheets = xlsx.parse(`${__dirname}/../data/DB.xlsx`);
  const sheet = sheets[sheetIndex].data;
  sheet.shift();
  return sheet;
};

export const extractStructuresFromCsv = async (): Promise<
  Omit<Structure, "id" | "latitude" | "longitude">[]
> => {
  const sheet = getSheet(0);
  return sheet
    .map((line) => ({
      dnaCode: line[0],
      operateur: line[1],
      type: line[2],
      nbPlaces: Number(line[3]),
      adresseAdministrative: line[4],
      communeAdministrative: line[5],
      codePostalAdministratif: String(line[6]),
      departementAdministratif: line[7],
      nom: line[8],
      debutConvention: new Date(line[9]),
      finConvention: new Date(line[10]),
      cpom: convertToBoolean(line[11]),
      creationDate: new Date(line[12]),
      finessCode: String(line[13]),
      lgbt: convertToBoolean(line[14]),
      fvvTeh: convertToBoolean(line[15]),
      public: convertToPublicType(line[16]),
      periodeAutorisationStart: new Date(line[17]),
      periodeAutorisationEnd: new Date(line[18]),
      cpomStart: new Date(line[19]),
      cpomEnd: new Date(line[20]),
    }))
    .filter((structure) => structure.operateur);
};

export const extractAdressesFromCsv = async (): Promise<
  Omit<Adresse, "id">[]
> => {
  const sheet = getSheet(1);
  return sheet
    .map((line) => ({
      id: line[0],
      structureDnaCode: line[1],
      adresse: line[2],
      codePostal: String(line[3]),
      commune: line[4],
      repartition: convertToRepartition(line[5]),
    }))
    .filter((structure) => structure.structureDnaCode);
};

export const extractContactsFromCsv = async (): Promise<
  Omit<Contact, "id">[]
> => {
  const sheet = getSheet(2);
  return sheet
    .map((line) => ({
      structureDnaCode: line[0],
      prenom: line[1],
      nom: line[2],
      telephone: String(line[3]),
      email: line[4],
      role: line[5],
    }))
    .filter((structure) => structure.structureDnaCode);
};

export const extractTypologiesFromCsv = async (): Promise<
  Omit<Typologie, "id">[]
> => {
  const sheet = getSheet(7);
  return sheet
    .map((line) => ({
      adresseId: line[0],
      date: new Date(line[2]),
      nbPlacesTotal: line[3],
      qpv: line[4],
      logementSocial: line[5],
    }))
    .filter((structure) => structure.adresseId);
};
