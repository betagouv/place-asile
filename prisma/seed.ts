import { PrismaClient, Prisma, Structure } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import { CsvExtract } from "./utils/csv-extract";
import { extractActivitesFromOds } from "./utils/activites-extract";
import { getCoordinates } from "@/app/utils/adresse.util";

const prisma = new PrismaClient();
const {
  extractStructuresFromCsv,
  extractAdressesFromCsv,
  extractContactsFromCsv,
  extractAdresseTypologiesFromCsv,
  extractControlesFromCsv,
  extractEvaluationsFromCsv,
  extractEIGsFromCsv,
  extractStructureTypologiesFromCsv,
  extractBudgetsFromCsv,
} = new CsvExtract();

const seedStructures = async () => {
  const structures = extractStructuresFromCsv();
  for (const structure of structures) {
    const fullAdress = `${structure.adresseAdministrative}, ${structure.codePostalAdministratif} ${structure.communeAdministrative}`;
    console.log(`> Converting ${fullAdress}`);
    const coordinates = await getCoordinates(fullAdress);
    (structure as Structure).longitude = Prisma.Decimal(
      coordinates.longitude || 0
    );
    (structure as Structure).latitude = Prisma.Decimal(
      coordinates.latitude || 0
    );
    await prisma.structure.create({
      data: structure as Structure,
    });
  }
};

export async function seed(): Promise<void> {
  console.log(">>> 🗑️ Wiping existing data...");
  await wipeTables(prisma);
  console.log(">>> 🌱 Seeding structures...");
  await seedStructures();
  console.log(">>> 🌱 Seeding adresses...");
  await prisma.adresse.createMany({ data: extractAdressesFromCsv() });
  console.log(">>> 🌱 Seeding contacts...");
  await prisma.contact.createMany({ data: extractContactsFromCsv() });
  console.log(">>> 🌱 Seeding adresse typologies...");
  await prisma.adresseTypologie.createMany({
    data: extractAdresseTypologiesFromCsv(),
  });
  console.log(">>> 🌱 Seeding contrôles...");
  await prisma.controle.createMany({ data: extractControlesFromCsv() });
  console.log(">>> 🌱 Seeding évaluations...");
  await prisma.evaluation.createMany({ data: extractEvaluationsFromCsv() });
  console.log(">>> 🌱 Seeding EIGs...");
  await prisma.evenementIndesirableGrave.createMany({
    data: extractEIGsFromCsv(),
  });
  console.log(">>> 🌱 Seeding structure typologies...");
  await prisma.structureTypologie.createMany({
    data: extractStructureTypologiesFromCsv(),
  });
  console.log(">>> 🌱 Seeding activités...");
  await prisma.activite.createMany({ data: extractActivitesFromOds() });
  console.log(">>> 🌱 Seeding budgets...");
  await prisma.budget.createMany({ data: extractBudgetsFromCsv() });
}

seed();
