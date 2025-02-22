import xlsx from 'node-xlsx';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import { exportConfig } from './export-config.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const computeTypologie = (rawTypologie) => {
  if (rawTypologie?.includes("diffus")) {
    return "Diffus"
  }
  const mapping = {
    "D": "Diffus",
    "D regr": "Diffus",
    "R": "Collectif",
    "Collectif": "Collectif"
  }
  return mapping[rawTypologie]
}

const getCentresFromXslx = (filename, mapping) => {
  const sheets = xlsx.parse(`${dirname}/${filename}`);
  const firstSheet = sheets[0].data
  return firstSheet.map(line => ({
    operateur: line[mapping.operateur] || "",
    type: line[mapping.type] || "",
    nbPlaces: line[mapping.nbPlaces] || "",
    adresseHebergement: line[mapping.adresseHebergement] || "",
    codePostalHebergement: line[mapping.codePostalHebergement] || "",
    communeHebergement: line[mapping.communeHebergement] || "",
    nbHebergements: line[mapping.nbHebergements] || "",
    typologie: computeTypologie(line[mapping.typologie]) || ""
  })).filter(centre => centre.operateur)
}

const convertAddressToCoordinates = async (address, geographicCenter) => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1&${geographicCenter}`
  );
  const data = await result.json();
  return data?.features?.[0]?.geometry?.coordinates
}

const runMigration = async (geographicCenter, filename, mapping) => {
  const centres = getCentresFromXslx(filename, mapping)
  for (const centre of centres) {
    const adresseComplete = `${centre.adresseHebergement} ${centre.codePostalHebergement} ${centre.communeHebergement}`;
    console.log("Récupération de :", adresseComplete)
    const coordinates = await convertAddressToCoordinates(adresseComplete, geographicCenter);
    centre.coordinates = coordinates?.reverse()
  }
  return centres;
}

const migrateAll = async () => {
  console.log("========== Début de la migration ==========");
  const allCentres = [];
  for (const department of exportConfig) {
    console.log(`> Migration de ${department.name}`)
    const centres = await runMigration(department.center, department.filename, department.mapping)
    allCentres.push(...centres);
  }
  const centresWithIds = allCentres.map((centre, index) => ({...centre, id: index + 1}))
  fs.writeFileSync(`${dirname}/export.json`, JSON.stringify(centresWithIds))
  console.log("========== Fin de la migration ==========");
}

migrateAll()