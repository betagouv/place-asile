import xlsx from "node-xlsx";
import fs from "fs";

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
    return (
      !isPrahda && (line[0] === "Normandie" || line[0] === "Pays de la Loire")
    );
  })
  .map((line) => {
    const newLine = line.splice(2, 3);
    newLine.push(
      `https://placedasile.beta.gouv.fr/ajout-structure/${newLine[2]}/01-identification`
    );
    return newLine;
  });

const departements = [...new Set(structures.map((structure) => structure[0]))];

departements.forEach((departement) => {
  const structuresParDepartement = structures.filter((structure) => {
    return structure[0] === departement;
  });

  const buffer = xlsx.build([
    { name: "Structures", data: structuresParDepartement, options: {} },
  ]);
  fs.writeFile(`./scripts/structures-${departement}.xlsx`, buffer, (error) => {
    console.error(error);
  });
});
