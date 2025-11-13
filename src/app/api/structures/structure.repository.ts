import { FileUploadCategory, Prisma, Structure } from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import prisma from "@/lib/prisma";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";

import { createOrUpdateAdresses } from "../adresses/adresse.repository";
import { createOrUpdateBudgets } from "../budgets/budget.repository";
import { createOrUpdateContacts } from "../contacts/contact.repository";
import { createOrUpdateControles } from "../controles/controle.repository";
import { createOrUpdateEvaluations } from "../evaluations/evaluation.repository";
import { updateFileUploads } from "../files/file.repository";
import {
  createOrUpdateForms,
  initializeDefaultForms,
} from "../forms/form.repository";
import { updateStructureTypologies } from "../structure-typologies/structure-typologie.repository";
import {
  convertToPublicType,
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
      forms: {
        include: {
          formDefinition: true,
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

  for (const documentFinancier of structure.documentsFinanciers) {
    await prisma.fileUpload.update({
      where: { key: documentFinancier.key },
      data: {
        date: documentFinancier.date,
        category: (documentFinancier.category as FileUploadCategory) || null,
        structureDnaCode: structure.dnaCode,
      },
    });
  }

  // Initialiser les forms par défaut pour la nouvelle structure
  await initializeDefaultForms(structure.dnaCode);

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
  let updatedStructure = null;
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
    await updateStructureTypologies(structureTypologies);
    await createOrUpdateAdresses(adresses, structure.dnaCode);
    await updateFileUploads(
      actesAdministratifs,
      structure.dnaCode,
      "acteAdministratif"
    );
    await updateFileUploads(
      documentsFinanciers,
      structure.dnaCode,
      "documentFinancier"
    );
    await createOrUpdateControles(controles, structure.dnaCode);
    await createOrUpdateForms(forms, structure.dnaCode);
    await createOrUpdateEvaluations(evaluations, structure.dnaCode);
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec le code DNA ${structure.dnaCode}: ${error}`
    );
  }

  return updatedStructure;
};
