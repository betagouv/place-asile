import { getCoordinates } from "@/app/utils/adresse.util";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { Prisma, Structure } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";
import { StructureColumn } from "@/types/StructureColumn.type";

import {
  createAdresses,
  createOrUpdateAdresses,
} from "../adresses/adresse.repository";
import { handleAdresses } from "../adresses/adresse.util";
import { createOrUpdateBudgets } from "../budgets/budget.repository";
import { createOrUpdateContacts } from "../contacts/contact.repository";
import { createOrUpdateControles } from "../controles/controle.repository";
import { createOrUpdateCpomMillesimes } from "../cpoms/cpom.repository";
import { createOrUpdateEvaluations } from "../evaluations/evaluation.repository";
import {
  createDocumentsFinanciers,
  updateFileUploads,
} from "../files/file.repository";
import {
  createOrUpdateForms,
  initializeDefaultForms,
} from "../forms/form.repository";
import { createOrUpdateStructureMillesimes } from "../structure-millesimes/structure-millesime.repository";
import { updateStructureTypologies } from "../structure-typologies/structure-typologie.repository";
import {
  getStructureOrderBy,
  getStructureSearchWhere,
} from "./structure.service";
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
  operateurs: string | null;
  column?: StructureColumn | null;
  direction?: "asc" | "desc" | null;
  map?: boolean;
  selection?: boolean;
};
export const findBySearch = async ({
  search,
  page,
  type,
  bati,
  placesAutorisees,
  departements,
  operateurs,
  column,
  direction,
  map,
  selection,
}: SearchProps): Promise<Partial<Structure>[]> => {
  const where = getStructureSearchWhere({
    search,
    type,
    bati,
    departements,
    placesAutorisees,
    operateurs,
    selection,
  });

  if (map) {
    const mapStructuresIds = await prisma.structuresOrder.findMany({
      where,
      select: {
        id: true,
      },
    });
    return prisma.structure.findMany({
      where: {
        id: {
          in: mapStructuresIds.map((structure) => structure.id),
        },
      },
      select: {
        latitude: true,
        longitude: true,
      },
    });
  }

  const orderBy = getStructureOrderBy(
    column ?? "departementAdministratif",
    direction ?? "asc"
  );

  const structuresIds = await prisma.structuresOrder.findMany({
    where,
    skip: selection ? 0 : page ? page * DEFAULT_PAGE_SIZE : 0,
    take: selection ? undefined : DEFAULT_PAGE_SIZE,
    orderBy,
    select: {
      id: true,
    },
  });

  const structures = await prisma.structure.findMany({
    where: {
      id: {
        in: structuresIds.map((structure) => structure.id),
      },
    },
    include: {
      adresses: true,
      operateur: true,
      structureMillesimes: {
        orderBy: {
          date: "desc",
        },
      },
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

  const orderedStructures = structuresIds
    .map((structuresIds) => {
      return structures.find((structure) => structure.id === structuresIds.id);
    })
    .filter((structure) => structure !== undefined);

  return orderedStructures;
};

export const countBySearch = async ({
  search,
  type,
  bati,
  placesAutorisees,
  departements,
  operateurs,
}: SearchProps): Promise<number> => {
  const where = getStructureSearchWhere({
    search,
    type,
    bati,
    departements,
    placesAutorisees,
    operateurs,
  });

  return prisma.structuresOrder.count({
    where,
  });
};

const getLatestPlacesAutoriseesPerStructure = async (): Promise<number[]> => {
  const allTypologies = await prisma.structureTypologie.findMany({
    orderBy: {
      date: "desc",
    },
    select: {
      structureDnaCode: true,
      placesAutorisees: true,
    },
  });

  const seenStructures = new Set<string>();

  return allTypologies
    .filter((typology) => {
      if (
        seenStructures.has(typology.structureDnaCode) ||
        typology.placesAutorisees === null
      ) {
        return false;
      }
      seenStructures.add(typology.structureDnaCode);
      return true;
    })
    .map((typology) => typology.placesAutorisees as number);
};

export const getMaxPlacesAutorisees = async (): Promise<number> => {
  const latestPlacesAutoriseesOfEveryStructure =
    await getLatestPlacesAutoriseesPerStructure();
  return Math.max(...latestPlacesAutoriseesOfEveryStructure);
};

export const getMinPlacesAutorisees = async (): Promise<number> => {
  const latestPlacesAutoriseesOfEveryStructure =
    await getLatestPlacesAutoriseesPerStructure();
  return Math.min(...latestPlacesAutoriseesOfEveryStructure);
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
        departement: structure.departementAdministratif
          ? {
              connect: {
                numero: structure.departementAdministratif,
              },
            }
          : undefined,
        nom: structure.nom,
        date303: structure.date303,
        debutConvention: structure.debutConvention,
        finConvention: structure.finConvention,
        creationDate: structure.creationDate,
        finessCode: structure.finessCode,
        lgbt: structure.lgbt,
        fvvTeh: structure.fvvTeh,
        public: convertToPublicType(structure.public),
        debutPeriodeAutorisation: structure.debutPeriodeAutorisation,
        finPeriodeAutorisation: structure.finPeriodeAutorisation,
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
      cpomMillesimes,
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
      departementAdministratif,
      structureMillesimes,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,
      cpomStructures,
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
          departement: departementAdministratif
            ? {
                connect: {
                  numero: departementAdministratif,
                },
              }
            : undefined,
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
      await createOrUpdateCpomMillesimes(tx, cpomMillesimes, structure.dnaCode);
      await createOrUpdateStructureMillesimes(
        tx,
        structureMillesimes,
        structure.dnaCode
      );

      return updatedStructure;
    });
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec le code DNA ${structure.dnaCode}: ${error}`
    );
  }
};
