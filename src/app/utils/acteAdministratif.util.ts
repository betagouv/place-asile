import { v4 as uuidv4 } from "uuid";

import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { ActeAdministratifFormValues } from "@/schemas/forms/base/acteAdministratif.schema";
import { ActeAdministratifCategoryType } from "@/types/file-upload.type";

import { getCategoriesToDisplay } from "./categoryToDisplay.util";

export const getActesAdministratifsDefaultValues = (
  structure: StructureApiType
): ActeAdministratifFormValues[] => {
  const categoriesToDisplay = getCategoriesToDisplay(structure);
  const filteredActesAdministratifs = filterActesAdministratifs({
    structure,
    categoriesToDisplay,
  });

  const defaultValuesFromDb = getDefaultValuesFromDb(
    filteredActesAdministratifs
  );

  return [
    ...defaultValuesFromDb,
    ...createEmptyDefaultValues(
      categoriesToDisplay,
      filteredActesAdministratifs
    ),
  ];
};

const filterActesAdministratifs = ({
  structure,
  categoriesToDisplay,
}: {
  structure: StructureApiType;
  categoriesToDisplay: ActeAdministratifCategoryType[number][];
}): ActeAdministratifApiType[] => {
  return (structure.actesAdministratifs?.filter(
    (acteAdministratif) =>
      acteAdministratif?.category &&
      categoriesToDisplay.includes(
        acteAdministratif.category as ActeAdministratifCategoryType[number]
      )
  ) || []) as ActeAdministratifApiType[];
};

const getDefaultValuesFromDb = (
  filteredActesAdministratifs: ActeAdministratifApiType[] = []
): ActeAdministratifFormValues[] => {
  return filteredActesAdministratifs.map((acteAdministratif) => {
    const formattedFileUploads = {
      ...acteAdministratif,
      //TODO: Remove the uuid system
      uuid: uuidv4(),
      key: acteAdministratif.key,
      category: acteAdministratif.category,
      date: acteAdministratif.date || undefined,
      startDate: acteAdministratif.startDate || "",
      endDate: acteAdministratif.endDate || "",
      categoryName: acteAdministratif.categoryName || "Document",
      parentFileUploadId:
        Number(acteAdministratif.parentFileUploadId) || undefined,
    };
    return formattedFileUploads;
  });
};

export const createEmptyDefaultValues = (
  categoriesToDisplay: ActeAdministratifCategoryType[number][],
  filteredFileUploads: ActeAdministratifApiType[] = []
): ActeAdministratifFormValues[] => {
  const filesToAdd: {
    uuid: string;
    category: ActeAdministratifCategoryType[number];
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

  return filesToAdd as ActeAdministratifFormValues[];
};
