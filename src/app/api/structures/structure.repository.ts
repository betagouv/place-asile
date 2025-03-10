import { Structure } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export class StructureRepository {
  constructor() {}

  public async findAllWithLogements(): Promise<Structure[]> {
    return prisma.structure.findMany({
      include: {
        logements: true,
      },
    });
  }

  public async findOne(id: number): Promise<Structure | null> {
    return prisma.structure.findUnique({
      where: {
        id,
      },
      include: {
        logements: true,
        contacts: true,
      },
    });
  }
}
