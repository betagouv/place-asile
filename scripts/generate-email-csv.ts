import fs from "fs";
import xlsx from "node-xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sheets = xlsx.parse(`${__dirname}/operateurs.xlsx`, {
  cellDates: true,
  blankrows: false,
});

const sheet = sheets[0].data;
sheet.shift();
sheet.shift();
sheet.shift();

const structures = sheet
  .filter((line) => {
    const isPrahda = String(line[4]).startsWith("P");
    return !isPrahda && line[0] === "Bourgogne-Franche-Comté";
  })
  .map((line) => {
    const newLine = line.splice(2, 5);
    newLine.push(
      `https://placedasile.beta.gouv.fr/ajout-structure/${newLine[2]}`
    );
    return newLine;
  });

const departements = [...new Set(structures.map((structure) => structure[0]))];

departements.forEach((departement) => {
  const structuresParDepartement = structures.filter((structure) => {
    return structure[0] === departement;
  });

  const header = [
    [
      "Département",
      "Type de structure",
      "Code DNA",
      "Nom",
      "Opérateur",
      "Adresse du formulaire Place d'Asile",
    ],
  ];

  const buffer = xlsx.build([
    {
      name: "Structures",
      data: [...header, ...structuresParDepartement],
      options: {},
    },
  ]);
  fs.writeFile(`./scripts/structures-${departement}.xlsx`, buffer, (error) => {
    console.error(error);
  });
});
