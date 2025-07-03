import xlsx from "node-xlsx";
import {
  Adresse,
  Structure,
  Contact,
  AdresseTypologie,
  Controle,
  ControleType,
  Evaluation,
  EvenementIndesirableGrave,
  StructureTypologie,
  Budget,
} from "@prisma/client";

import {
  convertToStructureType,
  convertToPublicType,
  convertToRepartition,
} from "../../src/app/api/structures/structure.util";

const STRUCTURE_INDEX = 0;
const ADRESSE_INDEX = 1;
const CONTACT_INDEX = 2;
const CONTROLE_INDEX = 3;
const EVALUATION_INDEX = 4;
const EIG_INDEX = 5;
const STRUCTURE_TYPOLOGIE_INDEX = 6;
const ADRESSE_TYPOLOGIE_INDEX = 7;
const BUDGET_INDEX = 8;

export class CsvExtract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sheets: { name: string; data: any[][] }[] = [];

  constructor() {
    const sheets = xlsx.parse(`${__dirname}/../data/DB.xlsx`, {
      cellDates: true,
      blankrows: false,
    });
    this.sheets = sheets;
  }

  private convertToBoolean = (value: string): boolean => {
    return value === "Oui";
  };

  private convertToControleType = (controleType: string): ControleType => {
    const typesControles: Record<string, ControleType> = {
      Inopiné: ControleType.INOPINE,
      Programmé: ControleType.PROGRAMME,
    };
    return typesControles[controleType.trim()];
  };

  private getSheet = (sheetIndex: number) => {
    const sheet = this.sheets[sheetIndex].data;
    sheet.shift();
    return sheet;
  };

  public extractStructuresFromCsv = (): Omit<
    Structure,
    "id" | "latitude" | "longitude"
  >[] => {
    const sheet = this.getSheet(STRUCTURE_INDEX);
    return sheet.map((line) => ({
      dnaCode: line[0],
      operateur: line[1],
      filiale: "",
      type: convertToStructureType(line[2]),
      nbPlaces: Number(line[3]),
      adresseAdministrative: line[4].trim(),
      communeAdministrative: line[5].trim(),
      codePostalAdministratif: String(line[6]),
      departementAdministratif: line[7].trim(),
      nom: line[8],
      debutConvention: line[9] ? new Date(line[9]) : null,
      finConvention: line[10] ? new Date(line[10]) : null,
      cpom: this.convertToBoolean(line[11]),
      creationDate: new Date(line[12]),
      finessCode: line[13] ? String(line[13]) : null,
      lgbt: this.convertToBoolean(line[14]),
      fvvTeh: this.convertToBoolean(line[15]),
      public: convertToPublicType(line[16]),
      debutPeriodeAutorisation: line[17] ? new Date(line[17]) : null,
      finPeriodeAutorisation: line[18] ? new Date(line[18]) : null,
      debutCpom: line[19] ? new Date(line[19]) : null,
      finCpom: line[20] ? new Date(line[20]) : null,
      placesACreer: Number(line[21]),
      placesAFermer: Number(line[22]),
      echeancePlacesACreer: line[23] ? new Date(line[23]) : null,
      echeancePlacesAFermer: line[24] ? new Date(line[24]) : null,
      notes: line[25],
    }));
  };

  public extractAdressesFromCsv = (): Omit<Adresse, "id">[] => {
    const sheet = this.getSheet(ADRESSE_INDEX);
    return sheet.map((line) => ({
      id: line[0],
      structureDnaCode: line[1],
      adresse: line[2],
      codePostal: String(line[3]),
      commune: line[4],
      repartition: convertToRepartition(line[5]),
    }));
  };

  public extractContactsFromCsv = (): Omit<Contact, "id">[] => {
    const sheet = this.getSheet(CONTACT_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      prenom: line[1],
      nom: line[2],
      telephone: String(line[3]),
      email: line[4],
      role: line[5],
    }));
  };

  public extractControlesFromCsv = (): Omit<Controle, "id">[] => {
    const sheet = this.getSheet(CONTROLE_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      date: new Date(line[1]),
      type: this.convertToControleType(line[2]),
    }));
  };

  public extractEvaluationsFromCsv = (): Omit<Evaluation, "id">[] => {
    const sheet = this.getSheet(EVALUATION_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      date: new Date(line[1]),
      notePersonne: Number(line[2]),
      notePro: Number(line[3]),
      noteStructure: Number(line[4]),
      note: Number(line[5]),
    }));
  };

  public extractEIGsFromCsv = (): Omit<EvenementIndesirableGrave, "id">[] => {
    const sheet = this.getSheet(EIG_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      numeroDossier: String(line[1]),
      evenementDate: new Date(line[2]),
      declarationDate: new Date(line[3]),
      type: line[4],
    }));
  };

  public extractStructureTypologiesFromCsv = (): Omit<
    StructureTypologie,
    "id"
  >[] => {
    const sheet = this.getSheet(STRUCTURE_TYPOLOGIE_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      date: new Date(line[1]),
      pmr: Number(line[2]),
      lgbt: Number(line[3]),
      fvvTeh: Number(line[4]),
      nbPlaces: null,
    }));
  };

  public extractAdresseTypologiesFromCsv = (): Omit<
    AdresseTypologie,
    "id"
  >[] => {
    const sheet = this.getSheet(ADRESSE_TYPOLOGIE_INDEX);
    return sheet.map((line) => ({
      adresseId: line[0],
      date: new Date(line[2]),
      nbPlacesTotal: line[3],
      qpv: line[4],
      logementSocial: line[5],
    }));
  };

  public extractBudgetsFromCsv = (): Omit<Budget, "id">[] => {
    const sheet = this.getSheet(BUDGET_INDEX);
    return sheet.map((line) => ({
      structureDnaCode: line[0],
      date: new Date(line[1]),
      ETP: Number(line[2]),
      tauxEncadrement: Number(line[3]),
      coutJournalier: Number(line[4]),
      dotationDemandee: Number(line[5]),
      dotationAccordee: Number(line[6]),
      totalProduits: Number(line[7]),
      totalCharges: Number(line[8]),
      cumulResultatsNetsCPOM: Number(line[9]),
      repriseEtat: Number(line[10]),
      affectationReservesFondsDedies: Number(line[11]),
      reserveInvestissement: Number(line[12]),
      chargesNonReconductibles: Number(line[13]),
      reserveCompensationDeficits: Number(line[14]),
      reserveCompensationBFR: Number(line[15]),
      reserveCompensationAmortissements: Number(line[16]),
      fondsDedies: Number(line[17]),
      commentaire: line[18],
    }));
  };
}
