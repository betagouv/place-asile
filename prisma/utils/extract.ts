import xlsx from "node-xlsx";

const convertToBoolean = (value: string) => {
  return value === "Oui";
};

export const extractStructuresFromCsv = async () => {
  const sheets = xlsx.parse(`${__dirname}/../data/structures.csv`);
  const firstSheet = sheets[0].data;
  firstSheet.shift();
  return firstSheet
    .map((line) => ({
      dnaCode: line[0],
      operateur: line[1],
      type: line[2],
      nbPlaces: Number(line[3]),
      repartition: line[4],
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
      fvv: convertToBoolean(line[17]),
      teh: convertToBoolean(line[18]),
      public: line[19],
      periodeAutorisationStart: new Date(line[20]),
      periodeAutorisationEnd: new Date(line[21]),
      cpomStart: new Date(line[22]),
      cpomEnd: new Date(line[23]),
      nbPlacesLibres: Number(line[24]),
      nbPlacesVacantes: Number(line[25]),
    }))
    .filter((structure) => structure.operateur);
};

export const extractLogementsFromCsv = async () => {
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
    }))
    .filter((structure) => structure.structureDnaCode);
};
