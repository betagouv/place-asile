import { Prisma } from "@prisma/client";

import {
  ActeAdministratifCategory,
  DocumentFinancierCategory,
} from "@/types/file-upload.type";

export type StructureWithFileUploadsAndActivites = Prisma.StructureGetPayload<{
  include: { fileUploads: true; activites: true };
}>;

export const addPresencesIndues = (
  structure: StructureWithFileUploadsAndActivites
) => {
  const activitesWithPresencesIndues = structure.activites.map((activite) => {
    const presencesIndues =
      (activite?.presencesInduesBPI || 0) +
      (activite?.presencesInduesDeboutees || 0);
    return {
      ...activite,
      presencesIndues,
    };
  });

  return {
    ...structure,
    activites: activitesWithPresencesIndues,
  };
};

export const divideFileUploads = (
  structure: StructureWithFileUploadsAndActivites
) => {
  return {
    ...structure,
    actesAdministratifs: structure.fileUploads.filter((fileUpload) =>
      ActeAdministratifCategory.includes(
        fileUpload.category as (typeof ActeAdministratifCategory)[number]
      )
    ),
    documentsFinanciers: structure.fileUploads.filter((fileUpload) =>
      DocumentFinancierCategory.includes(
        fileUpload.category as (typeof DocumentFinancierCategory)[number]
      )
    ),
    fileUploads: undefined,
  };
};
