import {
  FileUploadCategory,
  Prisma,
  Structure,
} from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import prisma from "@/lib/prisma";
import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { AdresseApiType } from "@/schemas/api/adresse.schema";
import { BudgetApiType } from "@/schemas/api/budget.schema";
import { CodeDnaApiType } from "@/schemas/api/codeDna.schema";
import { ControleApiType } from "@/schemas/api/controle.schema";
import { DocumentFinancierApiType } from "@/schemas/api/documentFinancier.schema";
import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";

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
  return prisma.structure.findFirst({
    where: {
      OR: [ // TODO : modifier cette propriété pour déprécier dnaCode
        { dnaCode },
        {
          codesDna: {
            some: { code: dnaCode },
          },
        },
      ],
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
  const primaryCode =
    structure.codesDna.find((c) => c.type === "PRINCIPAL")?.code ||
    structure.codesDna[0]?.code;
  if (!primaryCode) {
    throw new Error("Aucun code DNA fourni pour la structure");
  }
  const newStructure = await prisma.structure.create({
    data: {
      dnaCode: primaryCode, // TODO : supprimer cette propriété
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
          data: structure.structureTypologies,
        },
      },
    },
  });

  const adresses = handleAdresses(newStructure.id, structure.adresses);

  for (const adresse of adresses) {
    await prisma.adresse.create({
      data: {
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: adresse.repartition,
        structureId: newStructure.id,
        adresseTypologies: {
          create: adresse.adresseTypologies,
        },
      },
    });
  }

  for (const documentFinancier of structure.documentsFinanciers) {
    await prisma.fileUpload.update({ // Question: pourquoi update ici ?
      where: { key: documentFinancier.key },
      data: {
        date: documentFinancier.date,
        category: (documentFinancier.category as FileUploadCategory) || null,
        structureId: newStructure.id,
      },
    });
  }

  // Initialiser les forms par défaut pour la nouvelle structure
  await initializeDefaultForms(newStructure.id);

  const updatedStructure = await findOne(newStructure.id);
  if (!updatedStructure) {
    throw new Error(
      `Impossible de trouver la structure avec le code DNA ${newStructure.dnaCode}`
    );
  }
  return updatedStructure;
};

// TODO : Il faudra revoir le call des contacts (liés aux codes DNA) en fonction de comment c'est géré en front. Le code est jusque là "mal géré"
// const createOrUpdateContacts = async (
//   contacts: Partial<ContactApiType>[] | undefined,
//   structureId: number
// ): Promise<void> => {
//   await Promise.all(
//     (contacts || []).map((contact) => {
//       return prisma.$transaction(async (tx) => {
//         // Resolve from explicit id, explicit code, or principal/any for the structure
//         let targetCodeDnaId: number | null = (contact as any).codeDnaId ?? null;
//         if (!targetCodeDnaId) {
//           const explicitCode: string | undefined = (contact as any).codeDna;
//           if (explicitCode) {
//             const byCode = await tx.codeDna.findFirst({
//               where: { structureId, code: explicitCode },
//               select: { id: true },
//             });
//             if (byCode) {
//               targetCodeDnaId = byCode.id;
//             }
//           }
//         }
//         if (!targetCodeDnaId) {
//           const principal = await tx.codeDna.findFirst({
//             where: { structureId, type: "PRINCIPAL" },
//             select: { id: true },
//           });
//           if (principal) {
//             targetCodeDnaId = principal.id;
//           } else {
//             const anyCode = await tx.codeDna.findFirst({
//               where: { structureId },
//               select: { id: true },
//             });
//             targetCodeDnaId = anyCode?.id ?? null;
//           }
//         }

//         return tx.contact.upsert({
//           where: { id: contact.id || 0 },
//           update: {
//             prenom: contact.prenom ?? "",
//             nom: contact.nom ?? "",
//             telephone: contact.telephone ?? "",
//             email: contact.email ?? "",
//             role: contact.role ?? "",
//             type: contact.type ?? ContactType.AUTRE,

//             },
//           },
//           create: {

//             prenom: contact.prenom ?? "",
//             nom: contact.nom ?? "",
//             telephone: contact.telephone ?? "",
//             email: contact.email ?? "",
//             role: contact.role ?? "",
//             type: contact.type ?? ContactType.AUTRE,
//           },
//         });
//       });
//     })
//   );
// };

const createOrUpdateBudgets = async (
  budgets: BudgetApiType[] | undefined,
  structureId: number
): Promise<void> => {
  await Promise.all(
    (budgets || []).map((budget) => {
      return prisma.budget.upsert({
        where: {
          structureId_date: {
            structureId: structureId,
            date: budget.date,
          },
        },
        update: budget,
        create: {
          structureId: structureId,
          ...budget,
        },
      });
    })
  );
};

const createOrUpdateCodesDna = async (
  codesDna: Partial<CodeDnaApiType>[] | undefined,
  structureId: number
): Promise<void> => {

  if (!codesDna) {
    return;
  }
  await Promise.all(
    codesDna.map((codeDna) =>
      prisma.codeDna.upsert({
        where: { code: codeDna.code },
        update: {
          type: codeDna.type,
          creationDate: codeDna.creationDate ?? new Date(),
          adresseAdministrative: codeDna.adresseAdministrative ?? "",
          codePostalAdministratif: codeDna.codePostalAdministratif ?? "",
          communeAdministrative: codeDna.communeAdministrative ?? "",
          departementAdministratif: codeDna.departementAdministratif ?? "",
          latitude: new Prisma.Decimal(codeDna.latitude ?? 0),
          longitude: new Prisma.Decimal(codeDna.longitude ?? 0),
        },
        create: {
          structureId,
          code: codeDna.code ?? "",
          type: codeDna.type,
          creationDate: codeDna.creationDate ?? new Date(),
          adresseAdministrative: codeDna.adresseAdministrative ?? "",
          codePostalAdministratif: codeDna.codePostalAdministratif ?? "",
          communeAdministrative: codeDna.communeAdministrative ?? "",
          departementAdministratif: codeDna.departementAdministratif ?? "",
          latitude: new Prisma.Decimal(codeDna.latitude ?? 0),
          longitude: new Prisma.Decimal(codeDna.longitude ?? 0),
        },
      })
    )
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
  structureId: number
): Promise<void> => {
  if (!adresses || adresses.length === 0) {
    return;
  }

  // Delete adresses that are not in the provided array
  await deleteAdresses(adresses, structureId);

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
  structureId: number
): Promise<void> => {
  const everyAdressesOfStructure = await prisma.adresse.findMany({
    where: { structureId: structureId },
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
  structureId: number
): Promise<void> => {
  const allControles = await prisma.controle.findMany({
    where: { structureId: structureId },
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
  structureId: number
): Promise<void> => {
  const allEvaluations = await prisma.evaluation.findMany({
    where: { structureId: structureId },
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
  structureId: number
): Promise<void> => {
  const allFileUploads = await prisma.fileUpload.findMany({
    where: { structureId: structureId },
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
  fileUploads:
    | Partial<ActeAdministratifApiType | DocumentFinancierApiType>[]
    | undefined,
  structureId: number
): Promise<void> => {
  if (!fileUploads || fileUploads.length === 0) {
    return;
  }

  await deleteFileUploads(fileUploads, structureId);

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
          structureId: structureId,
          parentFileUploadId: fileUpload.parentFileUploadId,
          controleId: fileUpload.controleId,
        },
      })
    )
  );
};

const createOrUpdateControles = async (
  controles: ControleApiType[] | undefined,
  structureId: number
): Promise<void> => {
  if (!controles || controles.length === 0) {
    return;
  }

  deleteControles(controles, structureId);

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
          structureId: structureId,
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
  structureId: number
): Promise<void> => {
  if (!evaluations || evaluations.length === 0) {
    return;
  }

  deleteEvaluations(evaluations, structureId);

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
          structureId: structureId,
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
    // no need to fetch codesDna here for contacts; resolved in helper
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      contacts,
      budgets,
      codesDna,
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
        id: structure.id,
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

    await createOrUpdateCodesDna(codesDna, structure.id);
    // await createOrUpdateContacts(contacts, structure.id);
    await createOrUpdateBudgets(budgets, structure.id);
    await updateStructureTypologies(structureTypologies);
    await createOrUpdateAdresses(adresses, structure.id);
    await updateFileUploads(actesAdministratifs, structure.id);
    await updateFileUploads(documentsFinanciers, structure.id);
    await createOrUpdateControles(controles, structure.id);
    await createOrUpdateForms(forms, structure.id);
    await createOrUpdateEvaluations(evaluations, structure.id);
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec l'id ${structure.id}: ${error}`
    );
  }

  return updatedStructure;
};
