import { Activite } from "@prisma/client";
import xlsx from "node-xlsx";

import { ActivitesMetadata, activitesMetadata } from "./activites-metadata";

const getPlacesVacantes = (
  metadata: ActivitesMetadata,
  line: (string | number | Date)[]
): number => {
  const totalPlaces = Number(line[metadata.nbPlacesIndex]);
  if (metadata.placesOccupeesIndex) {
    return totalPlaces - Number(line[metadata.placesOccupeesIndex]);
  } else {
    const tauxOccupation = line[metadata.tauxOccupationIndex as number];
    return totalPlaces - Math.floor(totalPlaces * (tauxOccupation as number));
  }
};

const mapToActivites = (sheet: (string | number | Date)[][], index: number) => {
  const metadata = activitesMetadata[index];
  // TODO : identifier l'origine des NaN
  return sheet.map((line) => ({
    date: new Date(metadata.date),
    structureDnaCode: String(line[metadata.dnaIndex]),
    nbPlaces: Number(line[metadata.nbPlacesIndex]) || 0,
    desinsectisation: metadata.desinsectisationIndex
      ? Number(line[metadata.desinsectisationIndex]) || 0
      : 0,
    remiseEnEtat: metadata.remiseEnEtatIndex
      ? Number(line[metadata.remiseEnEtatIndex]) || 0
      : 0,
    sousOccupation: metadata.sousOccupationIndex
      ? Number(line[metadata.sousOccupationIndex]) || 0
      : 0,
    travaux: metadata.travauxIndex
      ? Number(line[metadata.travauxIndex]) || 0
      : 0,
    placesIndisponibles: metadata.placesIndisponiblesIndex
      ? Number(line[metadata.placesIndisponiblesIndex]) || 0
      : 0,
    placesVacantes: getPlacesVacantes(metadata, line) || 0,
    presencesInduesBPI: metadata.presencesInduesBPIIndex
      ? Number(line[metadata.presencesInduesBPIIndex]) || 0
      : 0,
    presencesInduesDeboutees: metadata.presencesInduesDebouteesIndex
      ? Number(line[metadata.presencesInduesDebouteesIndex]) || 0
      : 0,
  }));
};

export const extractActivitesFromOds = (): Omit<Activite, "id">[] => {
  const sheets = xlsx.parse(`${__dirname}/../data/activites.ods`, {
    cellDates: true,
    blankrows: false,
  });

  const allActivites: Omit<Activite, "id">[] = [];
  sheets.forEach((sheet, index) => {
    const sheetData = sheet.data;
    sheetData.shift();
    sheetData.shift();
    sheetData.shift();
    const activites = mapToActivites(sheetData, index);
    activites.forEach((activite) => {
      if (existingStructureCodes.includes(activite.structureDnaCode)) {
        allActivites.push(activite);
      }
    });
  });

  return allActivites;
};

// TODO : delete this and import all data
const existingStructureCodes = [
  "C1402",
  "H1401",
  "R1401",
  "K1403",
  "C2703",
  "H2702",
  "R2701",
  "R2703",
  "H5004",
  "T5003",
  "R5001",
  "C5001",
  "C6103",
  "R7601",
  "P6103",
  "H6104",
  "C7604",
  "R7602",
  "K7602",
  "P7614",
  "C4406",
  "C4905",
  "K4407",
  "H4416",
  "C4904",
  "R4902",
  "K4901",
  "H4903",
  "C5301",
  "R5301",
  "H5302",
  "H5301",
  "C7204",
  "R7201",
  "P7209",
  "H7211",
  "C8504",
  "R8501",
  "C8503",
  "H8503",
];
