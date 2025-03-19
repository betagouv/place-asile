import { PrismaClient } from "@prisma/client";

export const wipeTables = async (prisma: PrismaClient) => {
  await prisma.typologie.deleteMany({});
  await prisma.adresse.deleteMany({});
  await prisma.controle.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.evenementIndesirableGrave.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.pmr.deleteMany({});
  await prisma.structure.deleteMany({});
};
