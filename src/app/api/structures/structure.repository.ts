import { Prisma, Structure } from "@prisma/client";

import { getCoordinates } from "@/app/utils/adresse.util";
import prisma from "@/lib/prisma";
import { CodeDnaApiType } from "@/schemas/api/codeDna.schema";
import {
  StructureCreationApiType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";
import { PrismaTransaction } from "@/types/prisma.type";

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
  const newStructure = await prisma.$transaction(async (tx) => {
    const fullAdress = `${structure.adresseAdministrative}, ${structure.codePostalAdministratif} ${structure.communeAdministrative}`;
    const coordinates = await getCoordinates(fullAdress);
    const primaryCode =
      structure.codesDna.find((c) => c.type === "PRINCIPAL")?.code ||
      structure.codesDna[0]?.code;
    if (!primaryCode) {
      throw new Error("Aucun code DNA fourni pour la structure");
    }
    const baseStructure = await tx.structure.create({
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
        structureTypologies: {
          createMany: {
            data: structure.structureTypologies,
          },
        },
      },
    });

    const adresses = handleAdresses(baseStructure.id, structure.adresses);

    await createOrUpdateCodesDna(tx, structure.codesDna, baseStructure.id);
    await createOrUpdateContacts(tx, structure.contacts, baseStructure.id);
    await createAdresses(tx, adresses, baseStructure.id);
    await createDocumentsFinanciers(
      tx,
      structure.documentsFinanciers,
      baseStructure.id
    );
    await initializeDefaultForms(tx, baseStructure.id);

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

const createOrUpdateCodesDna = async (
  tx: PrismaTransaction,
  codesDna: Partial<CodeDnaApiType>[] | undefined,
  structureId: number
): Promise<void> => {
  if (!codesDna || codesDna.length === 0) {
    return;
  }

  await Promise.all(
    codesDna.map((codeDna) =>
      tx.codeDna.upsert({
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

export const updateOne = async (
  structure: StructureUpdateApiType
): Promise<Structure> => {
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

    return await prisma.$transaction(async (tx) => {
      const updatedStructure = await tx.structure.update({
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

      await createOrUpdateCodesDna(tx, codesDna, updatedStructure.id);
      await createOrUpdateContacts(tx, contacts, updatedStructure.id);
      await createOrUpdateBudgets(tx, budgets, updatedStructure.id);
      await updateStructureTypologies(tx, structureTypologies);
      await createOrUpdateAdresses(tx, adresses, updatedStructure.id);
      await updateFileUploads(
        tx,
        actesAdministratifs,
        updatedStructure.id,
        "acteAdministratif"
      );
      await updateFileUploads(
        tx,
        documentsFinanciers,
        updatedStructure.id,
        "documentFinancier"
      );
      await createOrUpdateControles(tx, controles, updatedStructure.id);
      await createOrUpdateForms(tx, forms, updatedStructure.id);
      await createOrUpdateEvaluations(tx, evaluations, updatedStructure.id);

      return updatedStructure;
    });
  } catch (error) {
    throw new Error(
      `Impossible de mettre à jour la structure avec l'id ${structure.id}: ${error}`
    );
  }
};
