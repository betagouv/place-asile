import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient, StructureState } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

import { createDepartements } from "./seeders/departements-seed";
import {
  createFakeFormDefinition,
  createFakeFormStepDefinition,
} from "./seeders/form.seed";
import { createFakeOperateur } from "./seeders/operateur.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { convertToPrismaObject } from "./seeders/seed-util";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { createFakeStructureOfii } from "./seeders/structure-ofii.seed";
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
    data: createFakeFormStepDefinition(formDefinition.id),
  });

  const stepDefinitionIds = await prisma.formStepDefinition.findMany({
    where: { formDefinitionId: formDefinition.id },
    select: { id: true },
  });

  console.log(`✅ ${formStepDefinitions.count} FormStepDefinitions créées`);

  const departementsToInsert = createDepartements();
  await prisma.departement.createMany({
    data: departementsToInsert,
  });

  console.log(`🌍 Départements créés : ${departementsToInsert.length}`);

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
        stepDefinitionIds: stepDefinitionIds.map(
          (stepDefinition) => stepDefinition.id
        ),
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

  const operateurs = await prisma.operateur.findMany();
  const departements = await prisma.departement.findMany();
  for (const operateur of operateurs) {
    const structuresOfiiToInsert = Array.from({ length: 500 }, () => {
      const fakeStructureOfii = createFakeStructureOfii({
        type: faker.helpers.arrayElement([
          StructureType.CADA,
          StructureType.HUDA,
          StructureType.CAES,
          StructureType.CPH,
        ]),
        operateurId: operateur.id,
        departementNumero: faker.helpers.arrayElement(departements).numero,
      });
      console.log(
        `🏠 Ajout de la structure ofii ${fakeStructureOfii.dnaCode}...`
      );
      return fakeStructureOfii;
    });

    await prisma.structureOfii.createMany({
      data: structuresOfiiToInsert,
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
