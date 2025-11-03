import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient, StructureState } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

import { insertAdresses } from "./seeders/adresse.seed";
import { insertBudgets } from "./seeders/budget.seed";
import { createFakeCodesDna } from "./seeders/code-dna.seed";
import { createDepartements } from "./seeders/departements-seed";
import { insertFileUploads } from "./seeders/file-upload.seed";
import {
  createFakeFormDefinition,
  createFakeFormStepDefinition,
  insertFormsWithSteps,
} from "./seeders/form.seed";
import { createFakeOperateur } from "./seeders/operateur.seed";
import { seedParentChildFileUploads } from "./seeders/parent-child-file-upload.seed";
import { createFakeStuctureWithRelations } from "./seeders/structure.seed";
import { createFakeStructureOfii } from "./seeders/structure-ofii.seed";
import { insertStructureTypologies } from "./seeders/structure-typologie.seed";
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
      console.log(`🏠 Préparation de la structure ${fakeStructure.dnaCode}...`);
      return fakeStructure;
    });

    const createdOperateur = await prisma.operateur.create({ data: operateurToInsert });

    for (const s of structuresToInsert) {
      const {
        adresses,
        structureTypologies,
        budgets,
        fileUploads,
        forms,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        codesDna,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        controles,
        ...structureCore
      } = s;
      console.log(`🏗️  Création de la structure ${structureCore.dnaCode}...`);
      const createdStructure = await prisma.structure.create({
        data: {
          ...structureCore,
          operateurId: createdOperateur.id,
        },
      });

      // Insert codesDna avec leurs contacts
      console.log(`🔤 Insertion codes DNA pour ${createdStructure.id}...`);
      const fakeCodesDna = createFakeCodesDna(createdStructure.dnaCode);
      for (const codeDna of fakeCodesDna) {
        const { contacts, ...codeData } = codeDna;
        const createdCodeDna = await prisma.codeDna.create({
          data: {
            ...codeData,
            structureId: createdStructure.id,
          },
        });

        // Insert contacts pour ce code DNA
        if (contacts && contacts.length > 0) {
          await prisma.contact.createMany({
            data: contacts.map((c) => ({
              structureDnaCode: createdStructure.dnaCode,
              codeDnaCode: createdCodeDna.code,
              prenom: c.prenom ?? null,
              nom: c.nom ?? null,
              telephone: c.telephone ?? null,
              email: c.email ?? null,
              role: c.role ?? null,
              type: c.type,
            })),
          });
        }
      }

      // Create adresses linked to structure
      console.log(`📍 Insertion adresses pour ${createdStructure.id}...`);
      await insertAdresses(prisma, createdStructure.id, (adresses || []) as Parameters<typeof insertAdresses>[2]);

      // Create structure typologies
      console.log(`📊 Insertion typologies pour ${createdStructure.id}...`);
      await insertStructureTypologies(
        prisma,
        createdStructure.id,
        (structureTypologies || []) as Parameters<typeof insertStructureTypologies>[2]
      );

      // Create budgets (by legacy dnaCode constraint plus new structureId)
      console.log(`💶 Insertion budgets pour ${createdStructure.id}...`);
      await insertBudgets(prisma, createdStructure, (budgets || []) as Parameters<typeof insertBudgets>[2]);

      // Create files
      console.log(`📎 Insertion fichiers pour ${createdStructure.id}...`);
      await insertFileUploads(prisma, createdStructure, (fileUploads || []) as Parameters<typeof insertFileUploads>[2]);

      // Create forms and steps
      console.log(`📝 Insertion formulaires/étapes pour ${createdStructure.id}...`);
      await insertFormsWithSteps(prisma, createdStructure, (forms || []) as Parameters<typeof insertFormsWithSteps>[2]);
    }
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
      `📎 Ajout des fichiers parent-enfant pour la structure id=${structure.id}...`
    );
    await seedParentChildFileUploads(structure.id);
  }
}

seed();
