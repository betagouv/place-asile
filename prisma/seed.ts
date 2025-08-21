import { PrismaClient, StructureType, StructureState } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { fakerFR as faker } from "@faker-js/faker";
import { createFakeOperateur } from "./seeders/operateur.seed";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  console.log("🗑️ Suppression des données existantes...");
  await wipeTables(prisma);

  const operateursToInsert = Array.from({ length: 5 }, () =>
    createFakeOperateur()
  );

  for (const operateurToInsert of operateursToInsert) {
    const structuresToInsert = Array.from({ length: 5 }, () => {
      const fakeStructure = createFakeStuctureWithRelations({
        cpom: faker.datatype.boolean(),
        type: faker.helpers.enumValue(StructureType),
        state: faker.helpers.enumValue(StructureState),
      });
      console.log(`🏠 Ajout de la structure ${fakeStructure.dnaCode}...`);
      return fakeStructure;
    });

    const operateurWithStructures = {
      ...operateurToInsert,
      structures: structuresToInsert,
    };
    await prisma.operateur.create({
      data: convertToPrismaObject(operateurWithStructures),
    });
  }
}

seed();
