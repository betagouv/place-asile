import { Prisma, Structure } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { getCoordinates } from "@/app/utils/adresse.util";
import {
  convertToFileUploadCategory,
  convertToPublicType,
  convertToStructureType,
  handleAdresses,
} from "./structure.util";
import { CreateStructure } from "./structure.types";

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
      operateur: structure.operateur,
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
      fileUploads: {
        connect: structure.fileUploads.map((fileUpload) => ({
          key: fileUpload.key,
        })),
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
      `Failed to find structure with id ${newStructure.id} after creation`
    );
  }
  return updatedStructure;
};
