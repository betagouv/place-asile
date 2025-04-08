import { Structure } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export const findAll = async (): Promise<Structure[]> => {
  return prisma.structure.findMany({
    include: {
      adresses: {
        include: {
          typologies: {
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
          typologies: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
      contacts: true,
      pmrs: {
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
    },
  });
};
