import { FileUploadCategory, Prisma, Structure } from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import prisma from "@/lib/prisma";
import { AuthorType as CustomAuthorType } from "@/types/form.type";

import { createCompleteFormWithSteps } from "../forms/form.repository";
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
import {
  convertToControleType,
  convertToPublicType,
  convertToRepartition,
  convertToStructureType,
  handleAdresses,
} from "./structure.util";

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
    },
  });
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
      }
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
      oldOperateur: "Ancien opérateur : à supprimer",
      operateur: {
        connect: {
          id: structure.operateur.id,
        },
      },
      filiale: structure.filiale,
      latitude: Prisma.Decimal(coordinates.latitude || 0),
      longitude: Prisma.Decimal(coordinates.longitude || 0),
      type: convertToStructureType(structure.type),
      oldNbPlaces: -1,
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
    },
  });

  const adresses = handleAdresses(structure.dnaCode, structure.adresses);

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

  for (const fileUpload of structure.fileUploads) {
    await prisma.fileUpload.update({
      where: { key: fileUpload.key },
      data: {
        date: fileUpload.date,
        category: (fileUpload.category as FileUploadCategory) || null,
        structureDnaCode: structure.dnaCode,
      },
    });
  }

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

const getEveryAdresseTypologiesOfAdresses = async (
  adresses: UpdateAdresse[]
): Promise<Awaited<ReturnType<typeof prisma.adresseTypologie.findMany>>> => {
  const existingAdresseIds = adresses
    .filter((adresse) => adresse.id)
    .map((adresse) => adresse.id as number);

  let allTypologies: Awaited<
    ReturnType<typeof prisma.adresseTypologie.findMany>
  > = [];
  if (existingAdresseIds.length > 0) {
    allTypologies = await prisma.adresseTypologie.findMany({
      where: { adresseId: { in: existingAdresseIds } },
    });
  }
  return allTypologies;
};
const createOrUpdateAdresses = async (
  adresses: UpdateAdresse[] = [],
  structureDnaCode: string
): Promise<void> => {
  if (!adresses || adresses.length === 0) {
    return;
  }

  // Delete adresses that are not in the provided array
  await deleteAdresses(adresses, structureDnaCode);

  // Fetch all typologies for existing addresses
  const allTypologies = await getEveryAdresseTypologiesOfAdresses(adresses);

  for (const adresse of adresses) {
    if (adresse.id) {
      // Update existing address
      await prisma.adresse.update({
        where: { id: adresse.id },
        data: {
          adresse: adresse.adresse,
          codePostal: adresse.codePostal,
          commune: adresse.commune,
          repartition: convertToRepartition(adresse.repartition),
        },
      });

      // Delete typologies not in the array
      const existingTypologies = allTypologies.filter(
        (typologie) => typologie.adresseId === adresse.id
      );
      const typologiesToDelete = existingTypologies.filter(
        (existing) =>
          !adresse.adresseTypologies.some((t) => t.id === existing.id)
      );
      if (typologiesToDelete.length > 0) {
        await prisma.adresseTypologie.deleteMany({
          where: { id: { in: typologiesToDelete.map((t) => t.id) } },
        });
      }

      // Update or create typologies
      for (const typologie of adresse.adresseTypologies) {
        if (typologie.id) {
          // Update existing typologie
          await prisma.adresseTypologie.update({
            where: { id: typologie.id },
            data: typologie,
          });
        } else {
          // Create new typologie
          await prisma.adresseTypologie.create({
            data: {
              adresseId: adresse.id,
              placesAutorisees: typologie.placesAutorisees,
              date: typologie.date,
              qpv: typologie.qpv,
              logementSocial: typologie.logementSocial,
            },
          });
        }
      }
    } else {
      // Create new address with typologies
      await prisma.adresse.create({
        data: {
          adresse: adresse.adresse,
          codePostal: adresse.codePostal,
          commune: adresse.commune,
          repartition: convertToRepartition(adresse.repartition),
          structureDnaCode: structureDnaCode,
          adresseTypologies: {
            create: adresse.adresseTypologies,
          },
        },
      });
    }
  }
};

const deleteAdresses = async (
  adressesToKeep: UpdateAdresse[],
  structureDnaCode: string
): Promise<void> => {
  const everyAdressesOfStructure = await prisma.adresse.findMany({
    where: { structureDnaCode: structureDnaCode },
  });
  const adressesToDelete = everyAdressesOfStructure.filter(
    (adresse) => !adressesToKeep.some((a) => a.id === adresse.id)
  );
  await Promise.all(
    adressesToDelete.map((adresse) =>
      prisma.adresse.delete({ where: { id: adresse.id } })
    )
  );
};

const deleteControles = async (
  controlesToKeep: UpdateControle[],
  structureDnaCode: string
): Promise<void> => {
  const allControles = await prisma.controle.findMany({
    where: { structureDnaCode: structureDnaCode },
  });
  const controlesToDelete = allControles.filter(
    (controle) =>
      !controlesToKeep.some(
        (controleToKeep) => controleToKeep.id === controle.id
      )
  );
  await Promise.all(
    controlesToDelete.map((controle) =>
      prisma.controle.delete({ where: { id: controle.id } })
    )
  );
};

const deleteFileUploads = async (
  fileUploadsToKeep: UpdateFileUpload[],
  structureDnaCode: string
): Promise<void> => {
  const allFileUploads = await prisma.fileUpload.findMany({
    where: { structureDnaCode: structureDnaCode },
  });

  const fileUploadsToDelete = allFileUploads.filter(
    (fileUpload) =>
      !fileUploadsToKeep.some(
        (fileUploadToKeep) => fileUploadToKeep.key === fileUpload.key
      )
  );

  await Promise.all(
    fileUploadsToDelete.map((fileUpload) =>
      prisma.fileUpload.delete({ where: { id: fileUpload.id } })
    )
  );
};

const updateFileUploads = async (
  fileUploads: UpdateFileUpload[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!fileUploads || fileUploads.length === 0) {
    return;
  }

  await deleteFileUploads(fileUploads, structureDnaCode);

  await Promise.all(
    (fileUploads || []).map((fileUpload) =>
      prisma.fileUpload.update({
        where: { key: fileUpload.key },
        data: {
          date: fileUpload.date,
          category: (fileUpload.category as FileUploadCategory) || null,
          startDate: fileUpload.startDate,
          endDate: fileUpload.endDate,
          categoryName: fileUpload.categoryName,
          structureDnaCode,
          parentFileUploadId: fileUpload.parentFileUploadId,
          controleId: fileUpload.controleId,
        },
      })
    )
  );
};

const createOrUpdateControles = async (
  controles: UpdateControle[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!controles || controles.length === 0) {
    return;
  }

  deleteControles(controles, structureDnaCode);

  await Promise.all(
    (controles || []).map((controle) => {
      return prisma.controle.upsert({
        where: { id: controle.id },
        update: {
          type: convertToControleType(controle.type),
          date: controle.date,
          fileUploads: {
            connect: { key: controle.fileUploadKey },
          },
        },
        create: {
          structureDnaCode,
          type: convertToControleType(controle.type),
          date: controle.date!,
          fileUploads: {
            connect: { key: controle.fileUploadKey },
          },
        },
      });
    })
  );
};

export const updateOne = async (
  structure: UpdateStructure
): Promise<Structure> => {
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
      operateur,
      forms,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      typeBati,
      ...structureProperties
    } = structure;

    //TODO: use a Prisma transaction to avoid race conditions
    updatedStructure = await prisma.structure.update({
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

    await createOrUpdateContacts(contacts, structure.dnaCode);
    await createOrUpdateBudgets(budgets, structure.dnaCode);
    await updateStructureTypologies(typologies);
    await createOrUpdateAdresses(adresses, structure.dnaCode);
    await updateFileUploads(fileUploads, structure.dnaCode);
    await createOrUpdateControles(controles, structure.dnaCode);

    // Gérer les forms si présents
    if (forms) {
      await Promise.all(forms.map(async (form) => {
        await createCompleteFormWithSteps(structure.dnaCode, {
          formDefinition: form.formDefinition,
          status: form.status,
          formSteps: (form.formSteps || []).map(step => ({
            stepDefinitionId: step.stepDefinitionId,
            status: step.status,
            stepDefinition: {
              label: step.stepDefinition?.label || '',
              authorType: step.stepDefinition?.authorType || CustomAuthorType.OPERATEUR,
            }
          }))
        });
      }));
    }
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec le code DNA ${structure.dnaCode}: ${error}`
    );
  }

  return updatedStructure;
};
