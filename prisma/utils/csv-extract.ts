import xlsx from "node-xlsx";
import {
  Adresse,
  Repartition,
  Structure,
  Contact,
  PublicType,
  Typologie,
  StructureType,
  Controle,
  ControleType,
  Evaluation,
  EvenementIndesirableGrave,
  Pmr,
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
  return repartitions[repartition.trim()];
};

const convertToPublicType = (typePublic: string): PublicType => {
  const typesPublic: Record<string, PublicType> = {
    "tout public": PublicType.TOUT_PUBLIC,
    famille: PublicType.FAMILLE,
    "personnes isolées": PublicType.PERSONNES_ISOLEES,
  };
  return typesPublic[typePublic.trim().toLowerCase()];
};

const convertToStructureType = (structureType: string): StructureType => {
  const typesStructures: Record<string, StructureType> = {
    CADA: StructureType.CADA,
    HUDA: StructureType.HUDA,
    CPH: StructureType.CPH,
    CAES: StructureType.CAES,
    PRAHDA: StructureType.PRAHDA,
  };
  return typesStructures[structureType.trim()];
};

const convertToControleType = (controleType: string): ControleType => {
  const typesControles: Record<string, ControleType> = {
    Inopiné: ControleType.INOPINE,
    Programmé: ControleType.PROGRAMME,
  };
  return typesControles[controleType.trim()];
};

const getSheet = (sheetIndex: number) => {
  const sheets = xlsx.parse(`${__dirname}/../data/DB.xlsx`, {
    cellDates: true,
    blankrows: false,
  });
  const sheet = sheets[sheetIndex].data;
  sheet.shift();
  return sheet;
};

const STRUCTURE_INDEX = 0;
const ADRESSE_INDEX = 1;
const CONTACT_INDEX = 2;
const CONTROLE_INDEX = 3;
const EVALUATION_INDEX = 4;
const EIG_INDEX = 5;
const PMR_INDEX = 6;
const TYPOLOGIE_INDEX = 7;

export const extractStructuresFromCsv = (): Omit<
  Structure,
  "id" | "latitude" | "longitude"
>[] => {
  const sheet = getSheet(STRUCTURE_INDEX);
  return sheet.map((line) => ({
    dnaCode: line[0],
    operateur: line[1],
    type: convertToStructureType(line[2]),
    nbPlaces: Number(line[3]),
    adresseAdministrative: line[4].trim(),
    communeAdministrative: line[5].trim(),
    codePostalAdministratif: String(line[6]),
    departementAdministratif: line[7].trim(),
    nom: line[8],
    debutConvention: line[9] ? new Date(line[9]) : null,
    finConvention: line[10] ? new Date(line[10]) : null,
    cpom: convertToBoolean(line[11]),
    creationDate: new Date(line[12]),
    finessCode: line[13] ? String(line[13]) : null,
    lgbt: convertToBoolean(line[14]),
    fvvTeh: convertToBoolean(line[15]),
    public: convertToPublicType(line[16]),
    debutPeriodeAutorisation: line[17] ? new Date(line[17]) : null,
    finPeriodeAutorisation: line[18] ? new Date(line[18]) : null,
    debutCpom: line[19] ? new Date(line[19]) : null,
    finCpom: line[20] ? new Date(line[20]) : null,
    placesACreer: Number(line[21]),
    placesAFermer: Number(line[22]),
    echeancePlacesACreer: line[23] ? new Date(line[23]) : null,
    echeancePlacesAFermer: line[24] ? new Date(line[24]) : null,
  }));
};

export const extractAdressesFromCsv = (): Omit<Adresse, "id">[] => {
  const sheet = getSheet(ADRESSE_INDEX);
  return sheet.map((line) => ({
    id: line[0],
    structureDnaCode: line[1],
    adresse: line[2],
    codePostal: String(line[3]),
    commune: line[4],
    repartition: convertToRepartition(line[5]),
  }));
};

export const extractContactsFromCsv = (): Omit<Contact, "id">[] => {
  const sheet = getSheet(CONTACT_INDEX);
  return sheet.map((line) => ({
    structureDnaCode: line[0],
    prenom: line[1],
    nom: line[2],
    telephone: String(line[3]),
    email: line[4],
    role: line[5],
  }));
};

export const extractControlesFromCsv = (): Omit<Controle, "id">[] => {
  const sheet = getSheet(CONTROLE_INDEX);
  return sheet.map((line) => ({
    structureDnaCode: line[0],
    date: new Date(line[1]),
    type: convertToControleType(line[2]),
  }));
};

export const extractEvaluationsFromCsv = (): Omit<Evaluation, "id">[] => {
  const sheet = getSheet(EVALUATION_INDEX);
  return sheet.map((line) => ({
    structureDnaCode: line[0],
    date: new Date(line[1]),
    notePersonne: Number(line[2]),
    notePro: Number(line[3]),
    noteStructure: Number(line[4]),
    note: Number(line[5]),
  }));
};

export const extractEIGsFromCsv = (): Omit<
  EvenementIndesirableGrave,
  "id"
>[] => {
  const sheet = getSheet(EIG_INDEX);
  return sheet.map((line) => ({
    structureDnaCode: line[0],
    numeroDossier: String(line[1]),
    evenementDate: new Date(line[2]),
    declarationDate: new Date(line[3]),
    type: line[4],
  }));
};

export const extractPMRsFromCsv = (): Omit<Pmr, "id">[] => {
  const sheet = getSheet(PMR_INDEX);
  return sheet.map((line) => ({
    structureDnaCode: line[0],
    date: new Date(line[1]),
    nbPlaces: Number(line[2]),
  }));
};

export const extractTypologiesFromCsv = (): Omit<Typologie, "id">[] => {
  const sheet = getSheet(TYPOLOGIE_INDEX);
  return sheet.map((line) => ({
    adresseId: line[0],
    date: new Date(line[2]),
    nbPlacesTotal: line[3],
    qpv: line[4],
    logementSocial: line[5],
    lgbt: line[6],
    fvvTeh: line[7],
  }));
};
