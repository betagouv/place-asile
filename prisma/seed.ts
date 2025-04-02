import { PrismaClient, Structure } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import {
  extractAdressesFromCsv,
  extractStructuresFromCsv,
  extractContactsFromCsv,
  extractTypologiesFromCsv,
  extractControlesFromCsv,
  extractEvaluationsFromCsv,
  extractEIGsFromCsv,
  extractPMRsFromCsv,
} from "./utils/extract";

const prisma = new PrismaClient();

const convertAddressToCoordinates = async (address: string) => {
  console.log(`> Converting ${address}`);
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1`
  );
  const data = await result.json();
  return data?.features?.[0]?.geometry?.coordinates;
};

const seedStructures = async () => {
  const structures = await extractStructuresFromCsv();
  for (const structure of structures) {
    const coordinates = await convertAddressToCoordinates(
      `${structure.adresseAdministrative}, ${structure.codePostalAdministratif} ${structure.communeAdministrative}`
    );
    (structure as Structure).longitude = coordinates?.[0] || 0;
    (structure as Structure).latitude = coordinates?.[1] || 0;
    await prisma.structure.create({
      data: structure as Structure,
    });
  }
};

const seedAdresses = async () => {
  const adresses = await extractAdressesFromCsv();
  for (const adresse of adresses) {
    await prisma.adresse.create({
      data: adresse,
    });
  }
};

const seedContacts = async () => {
  const contacts = await extractContactsFromCsv();
  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact,
    });
  }
};

const seedTypologies = async () => {
  const typologies = await extractTypologiesFromCsv();
  for (const typologie of typologies) {
    await prisma.typologie.create({
      data: typologie,
    });
  }
};

const seedControles = async () => {
  const controles = await extractControlesFromCsv();
  for (const controle of controles) {
    await prisma.controle.create({
      data: controle,
    });
  }
};

const seedEvaluations = async () => {
  const evaluations = await extractEvaluationsFromCsv();
  for (const evaluation of evaluations) {
    await prisma.evaluation.create({
      data: evaluation,
    });
  }
};

const seedEIGs = async () => {
  const eigs = await extractEIGsFromCsv();
  for (const eig of eigs) {
    await prisma.evenementIndesirableGrave.create({
      data: eig,
    });
  }
};

const seedPmrs = async () => {
  const pmrs = await extractPMRsFromCsv();
  for (const pmr of pmrs) {
    await prisma.pmr.create({
      data: pmr,
    });
  }
};

export async function seed(): Promise<void> {
  await wipeTables(prisma);
  await seedStructures();
  await seedAdresses();
  await seedContacts();
  await seedTypologies();
  await seedControles();
  await seedEvaluations();
  await seedEIGs();
  await seedPmrs();
}

seed();
