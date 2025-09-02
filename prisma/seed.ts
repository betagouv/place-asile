import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient, StructureState } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

import { createFakeOperateur } from "./seeders/operateur.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { wipeTables } from "./utils/wipe";

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
