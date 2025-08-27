import { Prisma, Structure } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { getCoordinates } from "@/app/utils/adresse.util";
import {
  convertToControleType,
  convertToFileUploadCategory,
  convertToPublicType,
  convertToStructureType,
  handleAdresses,
} from "./structure.util";
import {
  CreateStructure,
  UpdateAdresse,
  UpdateBudget,
  UpdateContact,
  UpdateControle,
  UpdateFileUpload,
  UpdateStructure,
  UpdateStructureTypologie,
} from "./structure.types";

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
      newOperateur: true
    },
  });
};

export const findOne = async (id: number): Promise<Structure | null> => {
  return prisma.structure.findUnique({
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
      fileUploads: true,
      budgets: {
        orderBy: {
          date: "desc",
        },
      },
      newOperateur: true,
    },
  });
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
      structureTypologies: {
        orderBy: {
          date: "desc",
        },
      },
      evaluations: {
        orderBy: {
          date: "desc",
        },
      },
      controles: {
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
      fileUploads: true,
      budgets: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });
};

export const createOne = async (
  structure: CreateStructure
): Promise<Structure> => {
  const fullAdress = `${structure.adresseAdministrative}, ${structure.codePostalAdministratif} ${structure.communeAdministrative}`;
  const coordinates = await getCoordinates(fullAdress);
  const newStructure = await prisma.structure.create({
    data: {
      dnaCode: structure.dnaCode,
      operateur: "Ancien opérateur : à supprimer",
      newOperateur: {
        connect: {
          id: structure.newOperateur.id,
        },
      },
      filiale: structure.filiale,
      latitude: Prisma.Decimal(coordinates.latitude || 0),
      longitude: Prisma.Decimal(coordinates.longitude || 0),
      type: convertToStructureType(structure.type),
      nbPlaces: structure.nbPlaces,
      adresseAdministrative: structure.adresseAdministrative,
      codePostalAdministratif: structure.codePostalAdministratif,
      communeAdministrative: structure.communeAdministrative,
      departementAdministratif: structure.departementAdministratif,
      nom: structure.nom,
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
          data: structure.typologies,
        },
      },
      // TODO : supprimer ce connect ? (file upload ajoutés ligne 191)
      fileUploads: {
        connect: structure.fileUploads.map((fileUpload) => ({
          key: fileUpload.key,
        })),
      },
    },
  });

  const adresses = handleAdresses(structure.dnaCode, structure.adresses);

  // TODO : refacto with updateMany
  for (const adresse of adresses) {
    await prisma.adresse.create({
      data: {
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: adresse.repartition,
        structureDnaCode: adresse.structureDnaCode,
        adresseTypologies: {
          create: adresse.adresseTypologies,
        },
      },
    });
  }

  // TODO : refacto with updateMany
  await Promise.all(
    structure.fileUploads.map((fileUpload) =>
      prisma.fileUpload.update({
        where: { key: fileUpload.key },
        data: {
          date: fileUpload.date,
          category: convertToFileUploadCategory(fileUpload.category),
          structureDnaCode: structure.dnaCode,
        },
      })
    )
  );

  const updatedStructure = await findOne(newStructure.id);
  if (!updatedStructure) {
    throw new Error(
      `Impossible de trouver la structure avec le code DNA ${newStructure.dnaCode}`
    );
  }
  return updatedStructure;
};

const createOrUpdateContacts = async (
  contacts: UpdateContact[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (contacts || []).map((contact) => {
      if (contact.id) {
        return prisma.contact.update({
          where: { id: contact.id },
          data: contact,
        });
      } else {
        return prisma.contact.create({
          data: {
            structureDnaCode,
            ...contact,
          },
        });
      }
    })
  );
};

const createOrUpdateBudgets = async (
  budgets: UpdateBudget[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (budgets || []).map((budget) => {
      if (budget.id) {
        return prisma.budget.update({
          where: { id: budget.id },
          data: budget,
        });
      } else {
        return prisma.budget.create({
          data: {
            structureDnaCode,
            ...budget,
          },
        });
      }
    })
  );
};

const updateStructureTypologies = async (
  typologies: UpdateStructureTypologie[] | undefined
): Promise<void> => {
  await Promise.all(
    (typologies || []).map((typologie) => {
      return prisma.structureTypologie.update({
        where: { id: typologie.id },
        data: typologie,
      });
    })
  );
};

const updateAdresseTypologies = async (
  adresses: UpdateAdresse[] | undefined
): Promise<void> => {
  const adresseTypologies = adresses?.flatMap((adresse) => adresse.typologies);
  for (const adresseTypologie of adresseTypologies || []) {
    await prisma.adresseTypologie.updateMany({
      where: { id: adresseTypologie.id },
      data: adresseTypologie,
    });
  }
};

const updateFileUploads = async (
  fileUploads: UpdateFileUpload[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (fileUploads || []).map((fileUpload) =>
      prisma.fileUpload.update({
        where: { key: fileUpload.key },
        data: {
          date: fileUpload.date,
          category: convertToFileUploadCategory(fileUpload.category),
          startDate: fileUpload.startDate,
          endDate: fileUpload.endDate,
          categoryName: fileUpload.categoryName,
          structureDnaCode,
        },
      })
    )
  );
};

const createOrUpdateControles = async (
  controles: UpdateControle[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (controles || []).map((controle) => {
      if (controle.id) {
        return prisma.controle.update({
          where: { id: controle.id },
          data: {
            type: convertToControleType(controle.type),
            date: controle.date,
            fileUploads: {
              connect: { key: controle.fileUploadKey },
            },
          },
        });
      } else {
        return prisma.controle.create({
          data: {
            structureDnaCode,
            type: convertToControleType(controle.type),
            date: controle.date,
            fileUploads: {
              connect: { key: controle.fileUploadKey },
            },
          },
        });
      }
    })
  );
};

export const updateOne = async (
  structure: UpdateStructure
): Promise<Structure | null> => {
  let updatedStructure = null;
  try {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type,
      contacts,
      budgets,
      typologies,
      adresses,
      fileUploads,
      controles,
      newOperateur,
      ...structureProperties
    } = structure;
    updatedStructure = await prisma.structure.update({
      where: {
        dnaCode: structure.dnaCode,
      },
      data: {
        ...structureProperties,
        public: convertToPublicType(structure.public!),
        newOperateur: {
          connect: newOperateur
            ? {
                id: newOperateur?.id,
              }
            : undefined,
        },
      },
    });

    await createOrUpdateContacts(contacts, structure.dnaCode);
    await createOrUpdateBudgets(budgets, structure.dnaCode);
    await updateStructureTypologies(typologies);
    await updateAdresseTypologies(adresses);
    await updateFileUploads(fileUploads, structure.dnaCode);
    await createOrUpdateControles(controles, structure.dnaCode);
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec le code DNA ${structure.dnaCode}: ${error}`
    );
  }

  return updatedStructure;
};
