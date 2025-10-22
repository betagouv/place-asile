import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Controle, ControleType } from "@/types/controle.type";
import {
  AgentFileUploadCategoryType,
  FileUpload,
  zAgentFileUploadCategory,
} from "@/types/file-upload.type";
import { StructureWithLatLng } from "@/types/structure.type";

export const filterFileUploads = ({
  structure,
  categoriesToDisplay,
}: {
  structure: StructureWithLatLng;
  categoriesToDisplay: AgentFileUploadCategoryType[number][];
}) => {
  return structure.fileUploads?.filter(
    (fileUpload) =>
      fileUpload?.category &&
      categoriesToDisplay.includes(
        fileUpload.category as AgentFileUploadCategoryType[number]
      )
  );
};

export const getDefaultValuesFromDb = (
  filteredFileUploads: FileUpload[] = []
) => {
  return filteredFileUploads.map((fileUpload) => {
    const formattedFileUploads = {
      ...fileUpload,
      uuid: uuidv4(),
      key: fileUpload.key,
      category: String(fileUpload.category) as z.infer<
        typeof zAgentFileUploadCategory
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
};

export const createEmptyDefaultValues = (
  categoriesToDisplay: AgentFileUploadCategoryType[number][],
  filteredFileUploads: FileUpload[] = []
) => {
  const filesToAdd: {
    uuid: string;
    category: z.infer<typeof zAgentFileUploadCategory>;
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

export const getControlesDefaultValues = (controles: Controle[] = []) => {
  return controles.map((controle) => {
    return {
      id: controle.id,
      date:
        controle.date && controle.date instanceof Date
          ? controle.date.toISOString()
          : controle.date || undefined,
      type: ControleType[controle.type as unknown as keyof typeof ControleType],
      fileUploads: controle.fileUploads,
    };
  });
};
