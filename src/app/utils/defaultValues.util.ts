import { getRepartition } from "@/app/utils/structure.util";
import { FormAdresse } from "@/schemas/base/adresse.schema";
import { Repartition } from "@/types/adresse.type";
import { Contact } from "@/types/contact.type";
import { AgentFileUploadCategoryType } from "@/types/file-upload.type";
import { PublicType, StructureWithLatLng } from "@/types/structure.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

import { transformApiAdressesToFormAdresses } from "./adresse.util";
import { formatDate, formatDateString } from "./date.util";
import {
  createEmptyDefaultValues,
  filterFileUploads,
  getControlesDefaultValues,
  getDefaultValuesFromDb,
} from "./files.util";
import { getFinanceDocument } from "./getFinanceDocument.util";
import { isStructureAutorisee } from "./structure.util";

export const getDefaultValues = ({
  structure,
}: {
  structure: StructureWithLatLng;
}): Partial<StructureDefaultValues> => {
  const isAutorisee = isStructureAutorisee(structure.type);
  const repartition = getRepartition(structure);

  return {
    ...structure,
    nom: structure.nom ?? "",
    operateur: structure.operateur ?? undefined,
    creationDate: formatDateString(structure.creationDate),
    debutPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.debutPeriodeAutorisation)
      : undefined,
    finPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.finPeriodeAutorisation)
      : undefined,
    debutConvention: formatDateString(structure.debutConvention),
    finConvention: formatDateString(structure.finConvention),
    debutCpom: formatDateString(structure.debutCpom),
    finCpom: formatDateString(structure.finCpom),
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
    contacts: structure.contacts || [],
    adresseAdministrativeComplete: [
      structure.adresseAdministrative,
      structure.codePostalAdministratif,
      structure.communeAdministrative,
      structure.departementAdministratif,
    ]
      .filter(Boolean)
      .join(" "),
    adresseAdministrative: structure.adresseAdministrative || "",
    codePostalAdministratif: structure.codePostalAdministratif || "",
    communeAdministrative: structure.communeAdministrative || "",
    departementAdministratif: structure.departementAdministratif || "",
    typeBati: repartition,
    adresses: transformApiAdressesToFormAdresses(structure.adresses),
    typologies: structure?.structureTypologies?.map((typologie) => ({
      id: typologie.id,
      date: typologie.date,
      placesAutorisees: typologie.placesAutorisees,
      pmr: typologie.pmr,
      lgbt: typologie.lgbt,
      fvvTeh: typologie.fvvTeh,
    })),
    placesACreer: structure.placesACreer ?? undefined,
    placesAFermer: structure.placesAFermer ?? undefined,
    echeancePlacesACreer: structure.echeancePlacesACreer
      ? formatDate(structure.echeancePlacesACreer)
      : undefined,
    echeancePlacesAFermer: structure.echeancePlacesAFermer
      ? formatDate(structure.echeancePlacesAFermer)
      : undefined,
  };
};

export const getQualiteFormDefaultValues = ({
  structure,
  categoriesToDisplay,
}: {
  structure: StructureWithLatLng;
  categoriesToDisplay: AgentFileUploadCategoryType[number][];
}) => {
  const filteredFileUploads = filterFileUploads({
    structure,
    categoriesToDisplay,
  });

  const defaultValuesFromDb = getDefaultValuesFromDb(filteredFileUploads);

  const controles = getControlesDefaultValues(structure.controles);

  const defaultValues = {
    fileUploads: [
      ...defaultValuesFromDb,
      ...createEmptyDefaultValues(categoriesToDisplay, filteredFileUploads),
    ],
    controles,
  };

  return defaultValues;
};

export const getFinanceFormDefaultValues = ({
  structure,
}: {
  structure: StructureWithLatLng;
}) => {
  const isAutorisee = isStructureAutorisee(structure?.type);
  const { budgetArray, buildFileUploadsDefaultValues } = getFinanceDocument({
    structure,
    isAutorisee,
  });
  const defaultValues = {
    budgets: budgetArray,
    fileUploads: buildFileUploadsDefaultValues(),
  };
  return defaultValues;
};

type StructureDefaultValues = Omit<
  StructureWithLatLng,
  | "creationDate"
  | "nom"
  | "debutPeriodeAutorisation"
  | "finPeriodeAutorisation"
  | "debutConvention"
  | "finConvention"
  | "debutCpom"
  | "finCpom"
  | "finessCode"
  | "public"
  | "filiale"
  | "contacts"
  | "adresseAdministrativeComplete"
  | "adresseAdministrative"
  | "codePostalAdministratif"
  | "communeAdministrative"
  | "departementAdministratif"
  | "typologies"
  | "adresses"
  | "placesACreer"
  | "placesAFermer"
  | "echeancePlacesACreer"
  | "echeancePlacesAFermer"
> & {
  creationDate: string;
  nom: string;
  debutPeriodeAutorisation?: string;
  finPeriodeAutorisation?: string;
  debutConvention?: string;
  finConvention?: string;
  debutCpom?: string;
  finCpom?: string;
  finessCode?: string;
  public?: PublicType;
  filiale?: string;
  contacts: Contact[];
  adresseAdministrativeComplete: string;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  typeBati: Repartition;
  adresses: FormAdresse[];
  typologies?: StructureTypologie[];
  placesACreer?: number;
  placesAFermer?: number;
  echeancePlacesACreer?: string;
  echeancePlacesAFermer?: string;
};
