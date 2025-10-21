import { getRepartition } from "@/app/utils/structure.util";
import { FormAdresse } from "@/schemas/base/adresse.schema";
import { ControleFormValues } from "@/schemas/base/controles.schema";
import { FileUploadFormValues } from "@/schemas/base/documents.schema";
import { Repartition } from "@/types/adresse.type";
import { Budget } from "@/types/budget.type";
import { Contact } from "@/types/contact.type";
import { PublicType, StructureWithLatLng } from "@/types/structure.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

import { transformApiAdressesToFormAdresses } from "./adresse.util";
import { buildFileUploadsDefaultValues } from "./buildFileUploadsDefaultValues.util";
import { getCategoriesToDisplay } from "./categoryToDisplay.util";
import {
  formatDate,
  formatDateString,
  getDateStringToYear,
  getYearRange,
} from "./date.util";
import {
  createEmptyDefaultValues,
  filterFileUploads,
  getControlesDefaultValues,
  getDefaultValuesFromDb,
} from "./files.util";
import { isStructureAutorisee } from "./structure.util";

export const getDefaultValues = ({
  structure,
}: {
  structure: StructureWithLatLng;
}): Partial<StructureDefaultValues> => {
  const isAutorisee = isStructureAutorisee(structure.type);
  const repartition = getRepartition(structure);

  const { years } = getYearRange();
  const budgetsFilteredByYears =
    structure?.budgets?.filter((budget) =>
      years.includes(Number(getDateStringToYear(budget.date.toString())))
    ) || [];

  const budgets = Array(5)
    .fill({})
    .map((emptyBudget, index) => {
      if (index < budgetsFilteredByYears.length) {
        const budget = budgetsFilteredByYears[index];
        return {
          ...budget,
          date: formatDateString(budget.date),
        };
      }
      return emptyBudget;
    }) as [Budget, Budget, Budget, Budget, Budget];

  const categoriesToDisplay = getCategoriesToDisplay(structure);

  const filteredFileUploads = filterFileUploads({
    structure,
    categoriesToDisplay,
  });

  const defaultValuesFromDb = getDefaultValuesFromDb(filteredFileUploads);

  const controles = getControlesDefaultValues(structure.controles);

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
    budgets,
    fileUploads: [
      ...buildFileUploadsDefaultValues({ structure, isAutorisee }),
      ...defaultValuesFromDb,
      ...createEmptyDefaultValues(categoriesToDisplay, filteredFileUploads),
    ] as FileUploadFormValues[],
    controles,
  };
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
  | "fileUploads"
  | "controles"
  | "budgets"
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
  fileUploads: FileUploadFormValues[];
  controles: ControleFormValues[];
  budgets: [Budget, Budget, Budget, Budget, Budget];
};
