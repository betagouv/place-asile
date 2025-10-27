import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { ControleApiType } from "@/schemas/api/controle.schema";
import { FileUploadApiType } from "@/schemas/api/fileUpload.schema";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { ControleType } from "@/types/controle.type";
import {
  AgentFileUploadCategoryType,
  zAgentFileUploadCategory,
} from "@/types/file-upload.type";

export const filterFileUploads = ({
  structure,
  categoriesToDisplay,
}: {
  structure: StructureApiType;
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
  filteredFileUploads: FileUploadApiType[] = []
) => {
  return filteredFileUploads.map((fileUpload) => {
    const formattedFileUploads = {
      ...fileUpload,
      uuid: uuidv4(),
      key: fileUpload.key,
      category: String(fileUpload.category) as z.infer<
        typeof zAgentFileUploadCategory
      >,
      date: fileUpload.date,
      startDate: fileUpload.startDate,
      endDate: fileUpload.endDate,
      categoryName: fileUpload.categoryName || "Document",
      parentFileUploadId: Number(fileUpload.parentFileUploadId) || undefined,
    };
    return formattedFileUploads;
  });
};

export const createEmptyDefaultValues = (
  categoriesToDisplay: AgentFileUploadCategoryType[number][],
  filteredFileUploads: FileUploadApiType[] = []
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

export const getControlesDefaultValues = (
  controles: ControleApiType[] = []
) => {
  return controles.map((controle) => {
    return {
      id: controle.id,
      date: controle.date,
      type: ControleType[controle.type as unknown as keyof typeof ControleType],
      fileUploads: controle.fileUploads,
    };
  });
};
