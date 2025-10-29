import { PrismaClient } from "@prisma/client";

export const wipeTables = async (prisma: PrismaClient) => {
  await prisma.adresseTypologie.deleteMany({});
  await prisma.adresse.deleteMany({});
  await prisma.controle.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.evenementIndesirableGrave.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.structureTypologie.deleteMany({});
  await prisma.activite.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.structure.deleteMany({});
  await prisma.operateur.deleteMany({});
  await prisma.formStepDefinition.deleteMany({});
  await prisma.formStep.deleteMany({});
  await prisma.formDefinition.deleteMany({});
  await prisma.form.deleteMany({});
  await prisma.departement.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.referential.deleteMany({});
};
