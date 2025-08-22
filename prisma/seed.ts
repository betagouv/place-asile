import { PrismaClient, StructureType, StructureState } from "@prisma/client";
import { wipeTables } from "./utils/wipe";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { fakerFR as faker } from "@faker-js/faker";
import { createFakeOperateur } from "./seeders/operateur.seed";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  console.log("🗑️ Suppression des données existantes...");
  await wipeTables(prisma);

  const operateursToInsert = Array.from({ length: 5 }, (_, index) =>
    createFakeOperateur(index)
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

  // Create parent-child file upload relationships for a subset of structures
  console.log("📄 Création des relations parent-enfant pour les fichiers...");
  const structures = await prisma.structure.findMany({ take: 15 });

  for (const structure of structures) {
    console.log(
      `📎 Ajout des fichiers parent-enfant pour ${structure.dnaCode}...`
    );
    await seedParentChildFileUploads(structure.dnaCode);
  }
}

seed();
