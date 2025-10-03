import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Repartition } from "@/types/adresse.type";
import { Contact } from "@/types/contact.type";
import {
  DdetsFileUploadCategoryType,
  zDdetsFileUploadCategory,
} from "@/types/file-upload.type";
import { PublicType, StructureWithLatLng } from "@/types/structure.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

import { formatDate, formatDateString } from "./date.util";
import { isStructureAutorisee } from "./structure.util";

export type StructureDefaultValues = Omit<
  StructureWithLatLng,
  | "creationDate"
  | "nom"
  | "typeBati"
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
  | "placesACreer"
  | "placesAFermer"
  | "echeancePlacesACreer"
  | "echeancePlacesAFermer"
> & {
  // Override fields that need different types or transformations
  creationDate: string; // Convert from Date to string
  nom: string; // Convert from string | null to string
  typeBati: Repartition; // Ensure it's always Repartition, not undefined
  debutPeriodeAutorisation?: string; // Convert from Date to string | undefined
  finPeriodeAutorisation?: string; // Convert from Date to string | undefined
  debutConvention?: string; // Convert from Date to string | undefined
  finConvention?: string; // Convert from Date to string | undefined
  debutCpom?: string; // Convert from Date to string | undefined
  finCpom?: string; // Convert fromw Date to string | undefined
  finessCode?: string; // Convert from string | null to string | undefined
  public?: PublicType; // Convert from PublicType to string | undefined
  filiale?: string; // Convert from string | null to string | undefined
  contacts: Contact[]; // Convert from Contact[] | undefinedto Contact[]
  adresseAdministrativeComplete: string; // Computed field
  adresseAdministrative: string; // Convert from string | null to string
  codePostalAdministratif: string; // Convert from string | null to string
  communeAdministrative: string; // Convert from string | null to string
  departementAdministratif: string; // Convert from string | null to string
  typologies?: StructureTypologie[]; // Convert from StructureTypologie[] | undefined to StructureTypologie[] | undefined
  placesACreer?: number; // Convert from number | null to number | undefined
  placesAFermer?: number; // Convert from number | null to number | undefined
  echeancePlacesACreer?: string; // Convert from Date to string | undefined
  echeancePlacesAFermer?: string; // Convert from Date to string | undefined
};

export const getDefaultValues = ({
  structure,
}: {
  structure: StructureWithLatLng;
}): StructureDefaultValues => {
  const isAutorisee = isStructureAutorisee(structure.type);

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
    typeBati:
      (structure as { typeBati?: Repartition }).typeBati || Repartition.MIXTE,
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
