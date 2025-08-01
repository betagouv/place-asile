import { PrismaClient, StructureType, StructureState } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { fakerFR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  console.log("🗑️ Suppression des données existantes...");
  await wipeTables(prisma);

  const structuresToInsert = Array.from({ length: 25 }, () =>
    createFakeStuctureWithRelations({
      cpom: faker.datatype.boolean(),
      type: faker.helpers.enumValue(StructureType),
      state: faker.helpers.enumValue(StructureState),
    })
  );

  for (const structureToInsert of structuresToInsert) {
    console.log(`🏠 Ajout de la structure ${structureToInsert.dnaCode}...`);
    await prisma.structure.create({
      data: convertToPrismaObject(structureToInsert),
    });
  }
}

seed();
