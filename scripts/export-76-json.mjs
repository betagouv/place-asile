import xlsx from 'node-xlsx';
import path from 'path';
import {fileURLToPath} from 'url';

const parseXslx = () => {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const centres = xlsx.parse(`${dirname}/asile-76.xlsx`);
  console.log(">>>>>>>>>>", centres[0])
}

const convertAddressToCoordinates = async (address) => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1`
  );
  const data = await result.json();
  const coordinates = data.features[0].geometry.coordinates
  console.log(">>>>>>>>>>>", coordinates);
  return coordinates
}

const runMigration = () => {
  console.log("========== Start of migration ==========");
  convertAddressToCoordinates("8+bd+du+port");
  parseXslx()
  console.log("========== End of migration ==========");
}

runMigration()