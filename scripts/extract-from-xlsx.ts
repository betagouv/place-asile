import xlsx from "node-xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { extractConfig } from "./extract-config.js";
import { StructureWithLatLng } from "@/types/structure.type.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const computeTypologie = (rawTypologie: string): string => {
  if (rawTypologie?.includes("diffus")) {
    return "Diffus";
  }
  const mapping: Record<string, string> = {
    D: "Diffus",
    "D regr": "Diffus",
    R: "Collectif",
    Collectif: "Collectif",
  };
  return mapping[rawTypologie];
};

const getStructuresFromXslx = (
  filename: string,
  mapping: Record<string, number>
) => {
  const sheets = xlsx.parse(`${dirname}/${filename}`);
  const firstSheet = sheets[0].data;
  return firstSheet
    .map((line) => ({
      operateur: line[mapping.operateur] || "",
      type: line[mapping.type] || "",
      nbPlaces: line[mapping.nbPlaces] || 0,
      adresseHebergement: line[mapping.adresseHebergement] || "",
      codePostalHebergement: line[mapping.codePostalHebergement] || "",
      communeHebergement: line[mapping.communeHebergement] || "",
      nbHebergements: line[mapping.nbHebergements] || 0,
      adresseOperateur: line[mapping.adresseOperateur] || "",
      typologie: computeTypologie(line[mapping.typologie]) || "",
    }))
    .filter((structure) => structure.operateur);
};

const convertAddressToCoordinates = async (
  address: string,
  geographicCenter: string
) => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1&${geographicCenter}`
  );
  const data = await result.json();
  return data?.features?.[0]?.geometry?.coordinates;
};

const runMigration = async (
  geographicCenter: string,
  filename: string,
  mapping: Record<string, number>
) => {
  const structures = getStructuresFromXslx(filename, mapping);
  for (const structure of structures) {
    console.log("Récupération de :", structure.adresseOperateur);
    if (!structure.adresseOperateur) {
      (structure as StructureWithLatLng).longitude = 0;
      (structure as StructureWithLatLng).latitude = 0;
    } else {
      const coordinates = await convertAddressToCoordinates(
        structure.adresseOperateur,
        geographicCenter
      );
      (structure as StructureWithLatLng).longitude = coordinates?.[0] || 0;
      (structure as StructureWithLatLng).latitude = coordinates?.[1] || 0;
    }
  }
  return structures;
};

export const extractFromXslx = async (writeOnDisk: boolean) => {
  console.log("========== Début de la migration ==========");
  const allStructures = [];
  for (const department of extractConfig) {
    console.log(`> Migration de ${department.name}`);
    const structures = await runMigration(
      department.center,
      department.filename,
      department.mapping
    );
    allStructures.push(...structures);
  }
  console.log("========== Fin de la migration ==========");
  if (writeOnDisk) {
    fs.writeFileSync(`${dirname}/export.json`, JSON.stringify(allStructures));
  }
  return allStructures;
};

if (require.main === module) {
  extractFromXslx(true);
}
