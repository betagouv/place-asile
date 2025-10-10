import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { getRepartition } from "@/app/utils/structure.util";
import { FormAdresse } from "@/schemas/base/adresse.schema";
import { Repartition } from "@/types/adresse.type";
import { Contact } from "@/types/contact.type";
import {
  DdetsFileUploadCategoryType,
  zDdetsFileUploadCategory,
} from "@/types/file-upload.type";
import { PublicType, StructureWithLatLng } from "@/types/structure.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

import { formatDate, formatDateString } from "./date.util";
import { getFinanceDocument } from "./getFinanceDocument.util";
import { isStructureAutorisee } from "./structure.util";

export const getDefaultValues = ({
  structure,
}: {
  structure: StructureWithLatLng;
}): StructureDefaultValues => {
  const isAutorisee = isStructureAutorisee(structure.type);
  const repartition = getRepartition(structure);

  // We add adresseComplete (who is not saved in db) to the adresses
  // We also convert logementSocial and qpv to boolean
  // And also convert repartition db value to form value (capitalize only the first letter)
  let adresses: FormAdresse[] = [];
  if (Array.isArray(structure.adresses)) {
    adresses = structure.adresses.map((adresse) => ({
      ...adresse,
      repartition: (adresse.repartition.charAt(0).toUpperCase() +
        adresse.repartition.slice(1).toLowerCase()) as Repartition,
      adresseComplete: [adresse.adresse, adresse.codePostal, adresse.commune]
        .filter(Boolean)
        .join(" ")
        .trim(),
      adresseTypologies: adresse.adresseTypologies?.map((adresseTypologie) => ({
        ...adresseTypologie,
        logementSocial: adresseTypologie.logementSocial ? true : false,
        qpv: adresseTypologie.qpv ? true : false,
      })),
    }));
  }

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
    adresses,
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
  categoriesToDisplay: DdetsFileUploadCategoryType[number][];
}) => {
  const filteredFileUploads = structure.fileUploads?.filter(
    (fileUpload) =>
      fileUpload?.category &&
      categoriesToDisplay.includes(
        fileUpload.category as DdetsFileUploadCategoryType[number]
      )
  );

  const defaultValuesFromDb = (filteredFileUploads || [])?.map((fileUpload) => {
    const formattedFileUploads = {
      ...fileUpload,
      uuid: uuidv4(),
      key: fileUpload.key,
      category: String(fileUpload.category) as z.infer<
        typeof zDdetsFileUploadCategory
      >,
      date:
        fileUpload.date && fileUpload.date instanceof Date
          ? fileUpload.date.toISOString()
          : fileUpload.date || undefined,
      startDate:
        fileUpload.startDate && fileUpload.startDate instanceof Date
          ? fileUpload.startDate.toISOString()
          : fileUpload.startDate || undefined,
      endDate:
        fileUpload.endDate && fileUpload.endDate instanceof Date
          ? fileUpload.endDate.toISOString()
          : fileUpload.endDate || undefined,
      categoryName: fileUpload.categoryName || "Document",
      parentFileUploadId: Number(fileUpload.parentFileUploadId) || undefined,
    };
    return formattedFileUploads;
  });
  const createEmptyDefaultValues = () => {
    const filesToAdd: {
      uuid: string;
      category: z.infer<typeof zDdetsFileUploadCategory>;
    }[] = [];

    const missingCategories = categoriesToDisplay.filter(
      (category) =>
        !filteredFileUploads?.some(
          (fileUpload) => fileUpload.category === category
        )
    );

    missingCategories.forEach((category) => {
      filesToAdd.push({
        uuid: uuidv4(),
        category: category,
      });
    });

    return filesToAdd;
  };

  const defaultValues = {
    fileUploads: [...defaultValuesFromDb, ...createEmptyDefaultValues()],
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
