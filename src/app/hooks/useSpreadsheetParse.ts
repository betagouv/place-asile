import { Repartition } from "@/types/adresse.type";
import readXlsxFile, { Schema } from "read-excel-file";

export const useSpreadsheetParse = (): UseExcelParseResult => {
  const parseSpreadsheet = async (
    file: File,
    repartitionColumnIndex: number
  ): ParseXlsxResult => {
    const adresses: FormAdresse[] = [];
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
        ...row,
        adresseComplete: `${row.adresse} ${row.codePostal} ${row.ville}`,
        departement: "", // TODO : handle departement
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
    return parseSpreadsheet(file, -1);
  };

  const parseAdressesMixtes = (file: File): ParseXlsxResult => {
    return parseSpreadsheet(file, 6);
  };

  return { parseAdressesDiffuses, parseAdressesMixtes };
};

const schema: Schema = {
  Adresse: {
    prop: "adresse",
    type: String,
    required: true,
  },
  "Code postal": {
    prop: "codePostal",
    type: String,
    required: true,
  },
  Ville: {
    prop: "ville",
    type: String,
    required: true,
  },
  "Places autorisées": {
    prop: "places",
    type: Number,
    required: true,
  },
  "Logement social": {
    prop: "logementSocial",
    type: String,
    required: true,
  },
  QPV: {
    prop: "qpv",
    type: String,
    required: true,
  },
  Répartition: {
    prop: "repartition",
    type: String,
    oneOf: [Repartition.DIFFUS, Repartition.COLLECTIF],
    required: false,
  },
};

type ParseXlsxResult = Promise<FormAdresse[]>;

type UseExcelParseResult = {
  parseAdressesDiffuses: (file: File) => ParseXlsxResult;
  parseAdressesMixtes: (file: File) => ParseXlsxResult;
};

type FormAdresse = {
  adresse: string;
  adresseComplete: string;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  places: number;
  qpv: boolean;
  logementSocial: boolean;
};
