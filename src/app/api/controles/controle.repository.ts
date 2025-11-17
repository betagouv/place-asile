import { ControleApiType } from "@/schemas/api/controle.schema";
import { PrismaTransaction } from "@/types/prisma.type";

import { convertToControleType } from "./controle.util";

const deleteControles = async (
  tx: PrismaTransaction,
  controlesToKeep: ControleApiType[],
  structureId: number
): Promise<void> => {
  const allControles = await tx.controle.findMany({
    where: { structureId },
  });
  const controlesToDelete = allControles.filter(
    (controle) =>
      !controlesToKeep.some(
        (controleToKeep) => controleToKeep.id === controle.id
      )
  );
  await Promise.all(
    controlesToDelete.map((controle) =>
      tx.controle.delete({ where: { id: controle.id } })
    )
  );
};

export const createOrUpdateControles = async (
  tx: PrismaTransaction,
  controles: ControleApiType[] | undefined,
  structureId: number
): Promise<void> => {
  if (!controles || controles.length === 0) {
    return;
  }

  await deleteControles(tx, controles, structureId);

  await Promise.all(
    (controles || []).map((controle) => {
      return tx.controle.upsert({
        where: { id: controle.id || 0 },
        update: {
          type: convertToControleType(controle.type),
          date: controle.date,
          structureId,
          fileUploads: {
            // TODO : refactor to use array of fileUploads instead of fileUploadKey
            connect: { key: controle.fileUploadKey },
          },
        },
        create: {
          structureId,
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
