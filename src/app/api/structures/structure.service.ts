import { Prisma, Repartition, StructureType } from "@prisma/client";

import {
  ActeAdministratifCategory,
  DocumentFinancierCategory,
} from "@/types/file-upload.type";
import { StructureColumn } from "@/types/StructureColumn.type";

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

export const getStructureOrderBy = (
  column: StructureColumn,
  direction: "asc" | "desc"
): Prisma.StructureOrderByWithRelationInput[] => {
  let primaryOrder: Prisma.StructureOrderByWithRelationInput = {
    departementAdministratif: direction,
  };
  if (["dnaCode", "type", "finConvention"].includes(column)) {
    primaryOrder = { [column as StructureColumn]: direction };
  }
  if (column === "operateur") {
    primaryOrder = { operateur: { name: direction } };
  }
  return [
    primaryOrder,
    { departementAdministratif: "asc" },
    { operateur: { name: "asc" } },
    { type: "asc" },
  ];
};

export const getStructureSearchWhere = ({
  search,
  type,
  bati,
  departements,
}: {
  search: string | null;
  type: string | null;
  bati: string | null;
  departements: string | null;
}): Prisma.StructureWhereInput => {
  const where: Prisma.StructureWhereInput = {};
  if (type) {
    const typeList = type.split(",").filter(Boolean) as StructureType[];
    if (typeList.length > 0) {
      where.type = {
        in: typeList,
      };
    }
  }

  if (departements) {
    const departementList = departements.split(",").filter(Boolean);
    if (departementList.length > 0) {
      where.departementAdministratif = {
        in: departementList,
      };
    }
  }

  if (search) {
    where.OR = [
      {
        dnaCode: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        finessCode: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        nom: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        departementAdministratif: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        communeAdministrative: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        codePostalAdministratif: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        adresses: {
          some: {
            commune: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        operateur: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (bati) {
    const batiList = bati
      .split(",")
      .map((b: string) => b.trim().toUpperCase() as Repartition)
      .filter(Boolean);

    if (batiList.length === 1 && batiList[0] === "MIXTE") {
      where.AND = [
        {
          adresses: {
            some: { repartition: "DIFFUS" },
          },
        },
        {
          adresses: {
            some: { repartition: "COLLECTIF" },
          },
        },
      ];
    } else if (batiList.length === 1 && batiList[0] === "DIFFUS") {
      where.AND = [
        {
          adresses: {
            some: { repartition: "DIFFUS" },
          },
        },
        {
          adresses: {
            none: { repartition: "COLLECTIF" },
          },
        },
      ];
    } else if (batiList.length === 1 && batiList[0] === "COLLECTIF") {
      where.AND = [
        {
          adresses: {
            some: { repartition: "COLLECTIF" },
          },
        },
        {
          adresses: {
            none: { repartition: "DIFFUS" },
          },
        },
      ];
    } else if (
      batiList.includes("MIXTE") &&
      batiList.includes("DIFFUS") &&
      !batiList.includes("COLLECTIF")
    ) {
      where.AND = [
        {
          adresses: {
            some: { repartition: "DIFFUS" },
          },
        },
      ];
    } else if (
      batiList.includes("MIXTE") &&
      batiList.includes("COLLECTIF") &&
      !batiList.includes("DIFFUS")
    ) {
      where.OR = [
        {
          AND: [
            {
              adresses: {
                some: { repartition: "DIFFUS" },
              },
            },
            {
              adresses: {
                some: { repartition: "COLLECTIF" },
              },
            },
          ],
        },
        {
          AND: [
            {
              adresses: {
                some: { repartition: "COLLECTIF" },
              },
            },
            {
              adresses: {
                none: { repartition: "DIFFUS" },
              },
            },
          ],
        },
      ];
    } else if (
      batiList.includes("DIFFUS") &&
      batiList.includes("COLLECTIF") &&
      !batiList.includes("MIXTE")
    ) {
      where.OR = [
        {
          AND: [
            {
              adresses: {
                some: { repartition: "DIFFUS" },
              },
            },
            {
              adresses: {
                none: { repartition: "COLLECTIF" },
              },
            },
          ],
        },
        {
          AND: [
            {
              adresses: {
                some: { repartition: "COLLECTIF" },
              },
            },
            {
              adresses: {
                none: { repartition: "DIFFUS" },
              },
            },
          ],
        },
      ];
    }
  }

  return where;
};
