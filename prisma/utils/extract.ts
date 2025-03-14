import xlsx from "node-xlsx";
import { Logement, Repartition, Structure, Contact } from "@prisma/client";

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

export const extractStructuresFromCsv = async (): Promise<
  Omit<Structure, "id" | "latitude" | "longitude">[]
> => {
  const sheets = xlsx.parse(`${__dirname}/../data/structures.csv`);
  const firstSheet = sheets[0].data;
  firstSheet.shift();
  return firstSheet
    .map((line) => ({
      dnaCode: line[0],
      operateur: line[1],
      type: line[2],
      nbPlaces: Number(line[3]),
      repartition: convertToRepartition(line[4]),
      adresse: line[5],
      commune: line[6],
      codePostal: line[7],
      departement: line[8],
      nom: line[9],
      debutConvention: new Date(line[10]),
      finConvention: new Date(line[11]),
      qpv: convertToBoolean(line[12]),
      cpom: convertToBoolean(line[13]),
      creationDate: new Date(line[14]),
      finessCode: line[15],
      lgbt: convertToBoolean(line[16]),
      fvvTeh: convertToBoolean(line[17]),
      public: line[18],
      periodeAutorisationStart: new Date(line[19]),
      periodeAutorisationEnd: new Date(line[20]),
      cpomStart: new Date(line[21]),
      cpomEnd: new Date(line[22]),
    }))
    .filter((structure) => structure.operateur);
};

export const extractLogementsFromCsv = async (): Promise<
  Omit<Logement, "id">[]
> => {
  const sheets = xlsx.parse(`${__dirname}/../data/logements.csv`);
  const firstSheet = sheets[0].data;
  firstSheet.shift();
  return firstSheet
    .map((line) => ({
      structureDnaCode: line[0],
      adresse: line[1],
      codePostal: line[2],
      ville: line[3],
      qpv: convertToBoolean(line[4]),
      logementSocial: convertToBoolean(line[5]),
      nbPlaces: Number(line[6]),
    }))
    .filter((structure) => structure.structureDnaCode);
};

export const extractContactsFromCsv = async (): Promise<
  Omit<Contact, "id">[]
> => {
  const sheets = xlsx.parse(`${__dirname}/../data/contacts.csv`);
  const firstSheet = sheets[0].data;
  firstSheet.shift();
  return firstSheet
    .map((line) => ({
      structureDnaCode: line[0],
      prenom: line[1],
      nom: line[2],
      telephone: line[3],
      email: line[4],
      role: line[5],
    }))
    .filter((structure) => structure.structureDnaCode);
};
