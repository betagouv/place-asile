import xlsx from "node-xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { extractConfig } from "./extract-config.js";
import { CentreWithCoordinates } from "@/types/centre.type.js";

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

const getCentresFromXslx = (
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
      typologie: computeTypologie(line[mapping.typologie]) || "",
    }))
    .filter((centre) => centre.operateur);
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
  const centres = getCentresFromXslx(filename, mapping);
  for (const centre of centres) {
    const adresseComplete = `${centre.adresseHebergement} ${centre.codePostalHebergement} ${centre.communeHebergement}`;
    console.log("Récupération de :", adresseComplete);
    const coordinates = await convertAddressToCoordinates(
      adresseComplete,
      geographicCenter
    );
    (centre as CentreWithCoordinates).longitude = coordinates?.[0] || 0;
    (centre as CentreWithCoordinates).latitude = coordinates?.[1] || 0;
  }
  return centres;
};

export const extractFromXslx = async (writeOnDisk: boolean) => {
  console.log("========== Début de la migration ==========");
  const allCentres = [];
  for (const department of extractConfig) {
    console.log(`> Migration de ${department.name}`);
    const centres = await runMigration(
      department.center,
      department.filename,
      department.mapping
    );
    allCentres.push(...centres);
  }
  console.log("========== Fin de la migration ==========");
  if (writeOnDisk) {
    fs.writeFileSync(`${dirname}/export.json`, JSON.stringify(allCentres));
  }
  return allCentres;
};

if (require.main === module) {
  extractFromXslx(true);
}
