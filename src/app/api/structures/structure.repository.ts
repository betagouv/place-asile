import { Structure } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export class StructureRepository {
  constructor() {}

  public async findAll(): Promise<Structure[]> {
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
  }

  public async findOne(id: number): Promise<Structure | null> {
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
      },
    });
  }
}
