import prisma from "@/lib/prisma";
import { ControleApiType } from "@/schemas/api/controle.schema";

import { convertToControleType } from "../structures/structure.util";

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

export const createOrUpdateControles = async (
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
