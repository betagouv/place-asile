import xlsx from 'node-xlsx';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import { exportConfig } from './export-config.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const computeTypologie = (rawTypologie) => {
  const mapping = {
    "D": "Diffus",
    "D regr": "Diffus regroupé",
    "Collectif": "Collectif"
  }
  return mapping[rawTypologie]
}

const getCentresFromXslx = (filename) => {
  const sheets = xlsx.parse(`${dirname}/${filename}`);
  const firstSheet = sheets[0].data
  const centres = firstSheet.map(line => {
    return {
      operateur: line[0],
      type: line[1],
      nbPlaces: line[2],
      adresseHebergement: line[5],
      codePostalHebergement: line[6],
      communeHebergement: line[7],
      nbHebergements: line[8],
      typologie: computeTypologie(line[10])
    }
  }).filter(centre => centre.operateur)
  centres.shift()
  return centres
}

const convertAddressToCoordinates = async (address, geographicCenter) => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1&${geographicCenter}`
  );
  const data = await result.json();
  return data?.features?.[0]?.geometry?.coordinates
}

const runMigration = async (geographicCenter, filename) => {
  const centres = getCentresFromXslx(filename)
  for (const centre of centres) {
    const adresseComplete = `${centre.adresseHebergement} ${centre.codePostalHebergement} ${centre.communeHebergement}`;
    console.log("Récupération de :", adresseComplete)
    const coordinates = await convertAddressToCoordinates(adresseComplete, geographicCenter);
    centre.coordinates = coordinates?.reverse()
  }
  fs.writeFileSync(`${dirname}/export-76.json`, JSON.stringify(centres))
}

const migrateAll = async () => {
  console.log("========== Début de la migration ==========");
  for (const department of exportConfig) {
    console.log(`> Migration de ${department.name}`)
    runMigration(department.center, department.filename)
  }
  console.log("========== Fin de la migration ==========");
}

migrateAll()