import {
  ContactType,
  FileUploadCategory,
  Prisma,
  Structure,
} from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import prisma from "@/lib/prisma";
import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { AdresseApiType } from "@/schemas/api/adresse.schema";
import { BudgetApiType } from "@/schemas/api/budget.schema";
import { ContactApiType } from "@/schemas/api/contact.schema";
import { ControleApiType } from "@/schemas/api/controle.schema";
import { DocumentFinancierApiType } from "@/schemas/api/documentFinancier.schema";
import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import {
  ActeAdministratifCategory,
  DocumentFinancierCategory,
} from "@/types/file-upload.type";

import {
  createOrUpdateForms,
  initializeDefaultForms,
} from "../forms/form.repository";
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

const createOrUpdateContacts = async (
  contacts: Partial<ContactApiType>[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (contacts || []).map((contact) => {
      return prisma.contact.upsert({
        where: {
          structureDnaCode_type: {
            structureDnaCode: structureDnaCode,
            type: contact.type ?? ContactType.AUTRE,
          },
        },
        update: {
          prenom: contact.prenom ?? "",
          nom: contact.nom ?? "",
          telephone: contact.telephone ?? "",
          email: contact.email ?? "",
          role: contact.role ?? "",
          type: contact.type ?? ContactType.AUTRE,
        },
        create: {
          structureDnaCode,
          prenom: contact.prenom ?? "",
          nom: contact.nom ?? "",
          telephone: contact.telephone ?? "",
          email: contact.email ?? "",
          role: contact.role ?? "",
          type: contact.type ?? ContactType.AUTRE,
        },
      });
    })
  );
};

const createOrUpdateBudgets = async (
  budgets: BudgetApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  await Promise.all(
    (budgets || []).map((budget) => {
      return prisma.budget.upsert({
        where: {
          structureDnaCode_date: {
            structureDnaCode: structureDnaCode,
            date: budget.date,
          },
        },
        update: budget,
        create: {
          structureDnaCode,
          ...budget,
        },
      });
    })
  );
};

const updateStructureTypologies = async (
  typologies: Partial<StructureTypologieApiType>[] | undefined
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
  adresses: Partial<AdresseApiType>[]
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
  adresses: Partial<AdresseApiType>[] = [],
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
          !adresse.adresseTypologies?.some((t) => t.id === existing.id)
      );
      if (typologiesToDelete.length > 0) {
        await prisma.adresseTypologie.deleteMany({
          where: { id: { in: typologiesToDelete.map((t) => t.id) } },
        });
      }

      // Update or create typologies
      for (const typologie of adresse.adresseTypologies || []) {
        // Update existing typologie
        await prisma.adresseTypologie.upsert({
          where: { id: typologie.id || 0 },
          update: typologie,
          create: {
            adresseId: adresse.id,
            placesAutorisees: typologie.placesAutorisees,
            date: typologie.date,
            qpv: typologie.qpv,
            logementSocial: typologie.logementSocial,
          },
        });
      }
    }
  }
};

const deleteAdresses = async (
  adressesToKeep: Partial<AdresseApiType>[],
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
  controlesToKeep: ControleApiType[],
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

const deleteEvaluations = async (
  evaluationsToKeep: EvaluationApiType[],
  structureDnaCode: string
): Promise<void> => {
  const allEvaluations = await prisma.evaluation.findMany({
    where: { structureDnaCode: structureDnaCode },
  });
  const evaluationsToDelete = allEvaluations.filter(
    (evaluation) =>
      !evaluationsToKeep.some(
        (evaluationToKeep) => evaluationToKeep.id === evaluation.id
      )
  );
  await Promise.all(
    evaluationsToDelete.map((evaluation) =>
      prisma.evaluation.delete({ where: { id: evaluation.id } })
    )
  );
};

const deleteFileUploads = async (
  fileUploadsToKeep: Partial<
    ActeAdministratifApiType | DocumentFinancierApiType
  >[],
  structureDnaCode: string,
  category: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  const allFileUploads = await prisma.fileUpload.findMany({
    where: { structureDnaCode: structureDnaCode },
  });

  const fileUploadsToDelete = allFileUploads.filter((fileUpload) => {
    if (!fileUpload.category) {
      return false;
    }

    const isAllowedCategory =
      category === "acteAdministratif"
        ? ActeAdministratifCategory.includes(
            fileUpload.category as (typeof ActeAdministratifCategory)[number]
          )
        : DocumentFinancierCategory.includes(
            fileUpload.category as (typeof DocumentFinancierCategory)[number]
          );

    if (!isAllowedCategory) {
      return false;
    }

    return !fileUploadsToKeep.some(
      (fileUploadToKeep) => fileUploadToKeep.key === fileUpload.key
    );
  });

  await Promise.all(
    fileUploadsToDelete.map((fileUpload) =>
      prisma.fileUpload.delete({ where: { id: fileUpload.id } })
    )
  );
};

const updateFileUploads = async (
  fileUploads:
    | Partial<ActeAdministratifApiType | DocumentFinancierApiType>[]
    | undefined,
  structureDnaCode: string,
  category: "acteAdministratif" | "documentFinancier"
): Promise<void> => {
  if (!fileUploads || fileUploads.length === 0) {
    return;
  }

  await deleteFileUploads(fileUploads, structureDnaCode, category);

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
          evaluationId: fileUpload.evaluationId,
        },
      })
    )
  );
};

const createOrUpdateControles = async (
  controles: ControleApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!controles || controles.length === 0) {
    return;
  }

  deleteControles(controles, structureDnaCode);

  await Promise.all(
    (controles || []).map((controle) => {
      return prisma.controle.upsert({
        where: { id: controle.id || 0 },
        update: {
          type: convertToControleType(controle.type),
          date: controle.date,
          fileUploads: {
            // TODO : refactor to use array of fileUploads instead of fileUploadKey
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

const createOrUpdateEvaluations = async (
  evaluations: EvaluationApiType[] | undefined,
  structureDnaCode: string
): Promise<void> => {
  if (!evaluations || evaluations.length === 0) {
    return;
  }

  deleteEvaluations(evaluations, structureDnaCode);

  await Promise.all(
    (evaluations || []).map((evaluation) => {
      return prisma.evaluation.upsert({
        where: { id: evaluation.id || 0 },
        update: {
          date: evaluation.date,
          notePersonne: evaluation.notePersonne,
          notePro: evaluation.notePro,
          noteStructure: evaluation.noteStructure,
          note: evaluation.note,
          fileUploads: {
            connect: evaluation.fileUploads,
          },
        },
        create: {
          structureDnaCode,
          date: evaluation.date ?? "",
          notePersonne: evaluation.notePersonne,
          notePro: evaluation.notePro,
          noteStructure: evaluation.noteStructure,
          note: evaluation.note,
          fileUploads: {
            connect: evaluation.fileUploads,
          },
        },
      });
    })
  );
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
