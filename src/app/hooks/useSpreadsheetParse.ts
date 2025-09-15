import readXlsxFile, { Schema } from "read-excel-file";

import { Repartition } from "@/types/adresse.type";

import { FormAdresse } from "../utils/adresse.util";

export const useSpreadsheetParse = (): UseExcelParseResult => {
  const parseSpreadsheet = async (
    file: File,
    repartitionColumnIndex: number,
    isMixte: boolean
  ): ParseXlsxResult => {
    const adresses: FormAdresse[] = [];
    const schema = getSchema(isMixte);
    const { rows, errors } = await readXlsxFile(file, { schema });
    const filteredErrors = errors.filter((error) => error.row !== 2);
    if (filteredErrors.length > 0) {
      const errorMessage = filteredErrors
        .map(
          (error) => `Valeur invalide (${error.column} : ligne ${error.row})`
        )
        .join(", ");
      throw new Error(errorMessage);
    }
    rows.shift();
    rows.forEach((row) => {
      const adresse = {
        adresse: row.adresse,
        codePostal: row.codePostal,
        commune: row.ville,
        adresseComplete: `${row.adresse} ${row.codePostal} ${row.ville}`,
        departement: String(row.codePostal).substring(0, 2),
        repartition:
          repartitionColumnIndex === -1 ? Repartition.DIFFUS : row.repartition,
        places: row.places,
        qpv: row.qpv === "Oui",
        logementSocial: row.logementSocial === "Oui",
      } as unknown as FormAdresse;
      adresses.push(adresse);
    });
    return adresses;
  };

  const parseAdressesDiffuses = async (file: File): ParseXlsxResult => {
    return parseSpreadsheet(file, -1, false);
  };

  const parseAdressesMixtes = (file: File): ParseXlsxResult => {
    return parseSpreadsheet(file, 6, true);
  };

  return { parseAdressesDiffuses, parseAdressesMixtes };
};

const getSchema = (isMixte: boolean): Schema => ({
  Adresse: {
    column: "Adresse",
    type: String,
    required: true,
  },
  "Code postal": {
    column: "Code postal",
    type: String,
    required: true,
  },
  Ville: {
    column: "Ville",
    type: String,
    required: true,
  },
  "Places autorisées": {
    column: "Places autorisées",
    type: Number,
    required: true,
  },
  "Logement social": {
    column: "Logement social",
    type: String,
    oneOf: ["Oui", "Non"],
    required: true,
  },
  QPV: {
    column: "QPV",
    type: String,
    oneOf: ["Oui", "Non"],
    required: true,
  },
  "Type de bâti": {
    column: "Type de bâti",
    type: String,
    oneOf: [Repartition.DIFFUS, Repartition.COLLECTIF],
    required: isMixte,
  },
});

type ParseXlsxResult = Promise<FormAdresse[]>;

type UseExcelParseResult = {
  parseAdressesDiffuses: (file: File) => ParseXlsxResult;
  parseAdressesMixtes: (file: File) => ParseXlsxResult;
};
