import xlsx from 'node-xlsx';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';

const CENTER_76_DEPARTMENT = "lon=1,0135&lat=49.3918";

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

const getCentresFromXslx = () => {
  const sheets = xlsx.parse(`${dirname}/asile-76.xlsx`);
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
  })
  return centres.slice(1, 346)
}

const convertAddressToCoordinates = async (address) => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1&${CENTER_76_DEPARTMENT}`
  );
  const data = await result.json();
  return data?.features?.[0]?.geometry?.coordinates
}

const runMigration = async () => {
  console.log("========== Start of migration ==========");
  const centres = getCentresFromXslx()
  for (const centre of centres) {
    console.log("Récupération des coordonnées de :", centre.adresseHebergement)
    const coordinates = await convertAddressToCoordinates(centre.adresseHebergement);
    centre.coordinates = coordinates?.reverse()
  }
  fs.writeFileSync(`${dirname}/export-76.json`, JSON.stringify(centres))
  console.log("========== End of migration ==========");
}

runMigration()