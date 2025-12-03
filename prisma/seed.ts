import "dotenv/config";

import { fakerFR as faker } from "@faker-js/faker";

import { StructureType } from "@/types/structure.type";

import { createPrismaClient } from "./client";
import { createFakeCpoms } from "./seeders/cpom.seed";
import { createDepartements } from "./seeders/departements-seed";
import {
  createFakeFormDefinition,
  createFakeFormStepDefinition,
} from "./seeders/form.seed";
import { createFakeOperateur } from "./seeders/operateur.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { convertToPrismaObject } from "./seeders/seed-util";
import {
  createFakeStructure,
  createFakeStuctureWithRelations,
} from "./seeders/structure.seed";
import { wipeTables } from "./utils/wipe";

const prisma = createPrismaClient();

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

  const stepDefinitions = await prisma.formStepDefinition.findMany({
    where: { formDefinitionId: formDefinition.id },
    orderBy: { slug: "asc" },
    select: { id: true, slug: true },
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
    const departementAdministratif = String(
      faker.number.int({ min: 1, max: 95 })
    ).padStart(2, "0");
    const baseParams = {
      cpom: faker.datatype.boolean(),
      type: faker.helpers.arrayElement([
        StructureType.CADA,
        StructureType.HUDA,
        StructureType.CAES,
        StructureType.CPH,
      ]),
      isFinalised: faker.datatype.boolean(),
      formDefinitionId: formDefinition.id,
      stepDefinitions,
      operateurName: operateurToInsert.name,
      departementAdministratif,
    };
    const structuresToInsert = Array.from(
      { length: faker.number.int({ min: 20, max: 50 }) },
      () => {
        const fakeStructure = createFakeStuctureWithRelations({
          ...baseParams,
          ofii: false,
        });
        return fakeStructure;
      }
    );

    const structuresOfiiToInsert = Array.from(
      { length: faker.number.int({ min: 20, max: 50 }) },
      () => {
        const fakeStructure = createFakeStructure({
          ...baseParams,
          ofii: true,
        });
        return fakeStructure;
      }
    );

    const operateurWithStructures = {
      ...operateurToInsert,
      structures: [...structuresToInsert, ...structuresOfiiToInsert],
    };

    console.log(
      `🏠 Ajout de ${structuresToInsert.length} structures pour ${operateurToInsert.name}`
    );

    await prisma.operateur.create({
      data: convertToPrismaObject(operateurWithStructures),
    });
  }

  const structures = await prisma.structure.findMany({
    take: faker.number.int({ min: 30, max: 50 }),
  });
  console.log(
    `📎 Ajout des fichiers parent-enfant pour ${structures.length} structures`
  );

  for (const structure of structures) {
    await seedParentChildFileUploads(prisma, structure.dnaCode);
  }
  console.log("✅ Fichiers parent-enfant ajoutés");

  await createFakeCpoms(prisma);
}

seed();
