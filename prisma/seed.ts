import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient, StructureState } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

import { createFakeFormDefinition, createFakeFormStepDefinition } from "./seeders/form.seed";
// import { migrateFormsAndSteps } from "../scripts/one-off-scripts/20251020-migrate-forms-and-steps";
import { createFakeOperateur } from "./seeders/operateur.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { wipeTables } from "./utils/wipe";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  console.log("🗑️ Suppression des données existantes...");
  await wipeTables(prisma);

  // Créer d'abord les FormDefinitions et FormStepDefinitions
  console.log("📋 Création des FormDefinitions...");
  const formDefinition = await prisma.formDefinition.create({
    data: createFakeFormDefinition(),
  });

  const formStepDefinitions = await prisma.formStepDefinition.createMany({
    data: Array.from({ length: 6 }, () =>
      createFakeFormStepDefinition(formDefinition.id)
    ),
  });

  const stepDefinitionIds = await prisma.formStepDefinition.findMany({
    where: { formDefinitionId: formDefinition.id },
    select: { id: true }
  });

  console.log(`✅ ${formStepDefinitions.count} FormStepDefinitions créées`);

  const operateursToInsert = Array.from({ length: 5 }, (_, index) =>
    createFakeOperateur(index)
  );

  for (const operateurToInsert of operateursToInsert) {
    const structuresToInsert = Array.from({ length: 5 }, () => {
      const fakeStructure = createFakeStuctureWithRelations({
        cpom: faker.datatype.boolean(),
        type: faker.helpers.arrayElement([
          StructureType.CADA,
          StructureType.HUDA,
          StructureType.CAES,
          StructureType.CPH,
        ]),
        state: faker.helpers.enumValue(StructureState),
        formDefinitionId: formDefinition.id,
        stepDefinitionIds: stepDefinitionIds.map(s => s.id),
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

  console.log("🚀 Exécution du script one-off : migrate-forms-and-steps");
  // await migrateFormsAndSteps();
}

seed();
