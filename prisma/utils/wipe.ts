import { PrismaClient } from "@prisma/client";

export const wipeTables = async (prisma: PrismaClient) => {
  await prisma.controle.deleteMany({});
  await prisma.evenementIndesirableGrave.deleteMany({});
  await prisma.logement.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.structure.deleteMany({});
};
