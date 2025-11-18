import { Prisma, Structure } from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import prisma from "@/lib/prisma";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";

import {
  createAdresses,
  createOrUpdateAdresses,
} from "../adresses/adresse.repository";
import { handleAdresses } from "../adresses/adresse.util";
import { createOrUpdateBudgets } from "../budgets/budget.repository";
import { createOrUpdateContacts } from "../contacts/contact.repository";
import { createOrUpdateControles } from "../controles/controle.repository";
import { createOrUpdateEvaluations } from "../evaluations/evaluation.repository";
import {
  createDocumentsFinanciers,
  updateFileUploads,
} from "../files/file.repository";
import {
  createOrUpdateForms,
  initializeDefaultForms,
} from "../forms/form.repository";
import { updateStructureTypologies } from "../structure-typologies/structure-typologie.repository";
import { getStructureSearchWhere } from "./structure.service";
import { convertToPublicType, convertToStructureType } from "./structure.util";

export const findAll = async (): Promise<Structure[]> => {
  return prisma.structure.findMany({
    include: {
      adresses: {
        include: {
          adresseTypologies: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
      operateur: true,
      structureTypologies: {
        orderBy: {
          date: "desc",
        },
      },
      forms: {
        include: {
          formDefinition: true,
        },
      },
    },
  });
};

type SearchProps = {
  search: string | null;
  page: number | null;
  type: string | null;
  bati: string | null;
  placesAutorisees: string | null;
  departements: string | null;
  map?: boolean;
};
export const findBySearch = async ({
  search,
  page,
  type,
  bati,
  placesAutorisees,
  departements,
  map,
}: SearchProps): Promise<Partial<Structure>[]> => {
  const where = getStructureSearchWhere({
    search,
    type,
    bati,
    departements,
  });

  const structureIdsFilteredByPlacesAutorisees =
    await getStructureIdsByPlacesAutorisees(placesAutorisees);
  if (structureIdsFilteredByPlacesAutorisees) {
    where.id = {
      in: structureIdsFilteredByPlacesAutorisees,
    };
  }

  if (map) {
    return prisma.structure.findMany({
      where,
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  return prisma.structure.findMany({
    where,
    skip: page ? page * DEFAULT_PAGE_SIZE : 0,
    take: DEFAULT_PAGE_SIZE,
    include: {
      adresses: {
        include: {
          adresseTypologies: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
      operateur: true,
      structureTypologies: {
        orderBy: {
          date: "desc",
        },
      },
      forms: {
        include: {
          formDefinition: true,
        },
      },
    },
  });
};

export const countBySearch = async ({
  search,
  type,
  bati,
  placesAutorisees,
  departements,
}: SearchProps): Promise<number> => {
  const where = getStructureSearchWhere({
    search,
    type,
    bati,
    departements,
  });
  const structureIdsFilteredByPlacesAutorisees =
    await getStructureIdsByPlacesAutorisees(placesAutorisees);
  if (structureIdsFilteredByPlacesAutorisees) {
    where.id = {
      in: structureIdsFilteredByPlacesAutorisees,
    };
  }
  return prisma.structure.count({ where });
};

export const getMaxPlacesAutorisees = async (): Promise<number> => {
  const structures = await prisma.structure.findMany({
    include: {
      adresses: {
        include: {
          adresseTypologies: {},
        },
      },
    },
  });
  return structures.reduce((max, structure) => {
    return Math.max(
      max,
      structure.adresses.reduce((max, adresse) => {
        return max + adresse.adresseTypologies[0].placesAutorisees;
      }, 0)
    );
  }, 0);
};

const getStructureIdsByPlacesAutorisees = async (
  placesAutorisees: string | null
): Promise<number[] | null> => {
  if (!placesAutorisees) {
    return null;
  }

  const [minStr, maxStr] = placesAutorisees.split(",");
  const min = minStr ? parseInt(minStr, 10) : null;
  const max = maxStr ? parseInt(maxStr, 10) : null;

  if (min === null && max === null) {
    return null;
  }

  const result = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT s.id
    FROM "Structure" s
    LEFT JOIN "Adresse" a ON a."structureDnaCode" = s."dnaCode"
    LEFT JOIN LATERAL (
      SELECT aty."placesAutorisees"
      FROM "AdresseTypologie" aty
      WHERE aty."adresseId" = a.id
      ORDER BY aty."date" DESC
      LIMIT 1
    ) latest_typology ON true
    GROUP BY s.id
    HAVING 
      COALESCE(SUM(latest_typology."placesAutorisees"), 0) >= COALESCE(${min}, 0)
      AND COALESCE(SUM(latest_typology."placesAutorisees"), 0) <= COALESCE(${max}, 999999)
  `;

  return result.map((r) => r.id);
};

export const getMinPlacesAutorisees = async (): Promise<number> => {
  const structures = await prisma.structure.findMany({
    include: {
      adresses: {
        include: {
          adresseTypologies: true,
        },
      },
    },
  });
  return structures.reduce((min, structure) => {
    return Math.min(
      min,
      structure.adresses.reduce((min, adresse) => {
        return Math.min(min, adresse.adresseTypologies[0].placesAutorisees);
      }, Infinity)
    );
  }, Infinity);
};

export const findOne = async (id: number): Promise<Structure> => {
  const structure = await prisma.structure.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      adresses: {
        include: {
          adresseTypologies: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
      contacts: true,
      structureTypologies: {
        orderBy: {
          date: "desc",
        },
      },
      evaluations: {
        include: {
          fileUploads: true,
        },
        orderBy: {
          date: "desc",
        },
      },
      controles: {
        include: {
          fileUploads: true,
        },
        orderBy: {
          date: "desc",
        },
      },
      activites: {
        orderBy: {
          date: "desc",
        },
      },
      evenementsIndesirablesGraves: true,
      fileUploads: {
        include: {
          parentFileUpload: true,
          childFileUploads: true,
        },
      },
      budgets: {
        orderBy: {
          date: "desc",
        },
      },
      operateur: true,
      forms: {
        include: {
          formDefinition: true,
          formSteps: {
            include: {
              stepDefinition: true,
            },
          },
        },
      },
    },
  });
  return structure;
};

export const findByDnaCode = async (
  dnaCode: string
): Promise<Structure | null> => {
  return prisma.structure.findUnique({
    where: {
      dnaCode,
    },
    include: {
      adresses: {
        include: {
          adresseTypologies: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
      contacts: true,
      operateur: true,
      structureTypologies: {
        orderBy: {
          date: "desc",
        },
      },
      forms: {
        include: {
          formDefinition: true,
        },
      },
      fileUploads: true,
    },
  });
};

export const createOne = async (
  structure: StructureCreationApiType
): Promise<Structure> => {
  const newStructure = await prisma.$transaction(async (tx) => {
    const fullAdress = `${structure.adresseAdministrative}, ${structure.codePostalAdministratif} ${structure.communeAdministrative}`;
    const coordinates = await getCoordinates(fullAdress);
    const baseStructure = await tx.structure.create({
      data: {
        dnaCode: structure.dnaCode,
        operateur: {
          connect: {
            id: structure.operateur.id,
          },
        },
        filiale: structure.filiale,
        latitude: Prisma.Decimal(coordinates.latitude || 0),
        longitude: Prisma.Decimal(coordinates.longitude || 0),
        type: convertToStructureType(structure.type),
        adresseAdministrative: structure.adresseAdministrative,
        codePostalAdministratif: structure.codePostalAdministratif,
        communeAdministrative: structure.communeAdministrative,
        departementAdministratif: structure.departementAdministratif,
        nom: structure.nom,
        date303: structure.date303,
        debutConvention: structure.debutConvention,
        finConvention: structure.finConvention,
        cpom: structure.cpom,
        creationDate: structure.creationDate,
        finessCode: structure.finessCode,
        lgbt: structure.lgbt,
        fvvTeh: structure.fvvTeh,
        public: convertToPublicType(structure.public),
        debutPeriodeAutorisation: structure.debutPeriodeAutorisation,
        finPeriodeAutorisation: structure.finPeriodeAutorisation,
        debutCpom: structure.debutCpom,
        finCpom: structure.finCpom,
        contacts: {
          createMany: {
            data: structure.contacts,
          },
        },
        structureTypologies: {
          createMany: {
            data: structure.structureTypologies,
          },
        },
      },
    });

    const adresses = handleAdresses(structure.dnaCode, structure.adresses);

    await createAdresses(tx, adresses, structure.dnaCode);
    await createDocumentsFinanciers(
      tx,
      structure.documentsFinanciers,
      structure.dnaCode
    );
    await initializeDefaultForms(tx, structure.dnaCode);

    return baseStructure;
  });

  const updatedStructure = await findOne(newStructure.id);
  if (!updatedStructure) {
    throw new Error(
      `Impossible de trouver la structure avec le code DNA ${newStructure.dnaCode}`
    );
  }
  return updatedStructure;
};

export const updateOne = async (
  structure: StructureUpdateApiType
): Promise<Structure> => {
  try {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      contacts,
      budgets,
      structureTypologies,
      adresses,
      actesAdministratifs,
      documentsFinanciers,
      controles,
      evaluations,
      operateur,
      forms,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      evenementsIndesirablesGraves,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,
      activites,
      ...structureProperties
    } = structure;

    return await prisma.$transaction(async (tx) => {
      const updatedStructure = await tx.structure.update({
        where: {
          dnaCode: structure.dnaCode,
        },
        data: {
          ...structureProperties,
          public: convertToPublicType(structure.public!),
          operateur: {
            connect: operateur
              ? {
                  id: operateur?.id,
                }
              : undefined,
          },
        },
      });

      await createOrUpdateContacts(tx, contacts, structure.dnaCode);
      await createOrUpdateBudgets(tx, budgets, structure.dnaCode);
      await updateStructureTypologies(tx, structureTypologies);
      await createOrUpdateAdresses(tx, adresses, structure.dnaCode);
      await updateFileUploads(
        tx,
        actesAdministratifs,
        structure.dnaCode,
        "acteAdministratif"
      );
      await updateFileUploads(
        tx,
        documentsFinanciers,
        structure.dnaCode,
        "documentFinancier"
      );
      await createOrUpdateControles(tx, controles, structure.dnaCode);
      await createOrUpdateForms(tx, forms, structure.dnaCode);
      await createOrUpdateEvaluations(tx, evaluations, structure.dnaCode);

      return updatedStructure;
    });
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec le code DNA ${structure.dnaCode}: ${error}`
    );
  }
};
