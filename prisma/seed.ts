import { Logement, PrismaClient, Structure } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import {
  extractLogementsFromCsv,
  extractStructuresFromCsv,
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
    const coordinates = await convertAddressToCoordinates(structure.adresse);
    (structure as Structure).longitude = coordinates?.[0] || 0;
    (structure as Structure).latitude = coordinates?.[1] || 0;
    await prisma.structure.create({
      data: structure as Structure,
    });
  }
};

const seedLogements = async () => {
  const logements = await extractLogementsFromCsv();
  for (const logement of logements) {
    await prisma.logement.create({
      data: logement as Logement,
    });
  }
};

export async function seed(): Promise<void> {
  await wipeTables(prisma);
  await seedStructures();
  await seedLogements();
}

seed();
