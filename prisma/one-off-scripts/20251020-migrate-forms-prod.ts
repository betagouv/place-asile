// scripts/migrate-forms-prod.ts
import { AuthorType, PrismaClient, StepStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function migrateFormsProduction() {
    console.log('🚀 Début de la migration des Forms...');

    // Créer FormDefinition
    const formDefinition = await prisma.formDefinition.upsert({
        where: {
        name_version: {
            name: 'Structure agent',
            version: 1
        }
        },
        update: {},
        create: {
        name: 'Structure agent',
        version: 1,
        }
    });

    console.log('✅ FormDefinition créée');

    // Créer les FormStepDefinitions
    const steps = [
        { label: 'Identification de la structure', authorType: AuthorType.OPERATEUR},
        { label: 'Documents financiers', authorType: AuthorType.OPERATEUR },
        { label: 'Analyse financière', authorType: AuthorType.AGENT },
        { label: 'Contrôle qualité et objectifs', authorType: AuthorType.AGENT },
        { label: 'Actes administratifs', authorType: AuthorType.AGENT },
        { label: 'Notes', authorType: AuthorType.AGENT },
    ];

    const stepDefinitions = [];
    for (const step of steps) {
        const stepDefinition = await prisma.formStepDefinition.upsert({
        where: {
            formDefinitionId_label: {
            formDefinitionId: formDefinition.id,
            label: step.label
            }
        },
        update: {},
        create: {
            formDefinitionId: formDefinition.id,
            label: step.label,
            authorType: step.authorType,
        }
        });

        stepDefinitions.push(stepDefinition);
    }
    console.log('✅ FormStepDefinitions créées');

    // Récupérer toutes les Structures et créer les Forms et Formsteps
    const structures = await prisma.structure.findMany();
    console.log(`📊 ${structures.length} structures trouvées`);

    let createdForms = 0;
    let createdSteps = 0;

    for (const structure of structures) {
        const form = await prisma.form.upsert({
        where: {
            structureCodeDna_formDefinitionId: {
            structureCodeDna: structure.dnaCode,
            formDefinitionId: formDefinition.id
            }
        },
        update: {},
        create: {
            structureCodeDna: structure.dnaCode,
            formDefinitionId: formDefinition.id,
            status: structure.state === 'FINALISE',
        }
        });
        createdForms++;

        for (const stepDefinition of stepDefinitions) {
        let status: StepStatus = StepStatus.NON_COMMENCE;

        if (structure.state === 'FINALISE') {
            status = StepStatus.VALIDE;
        } else if (stepDefinition.authorType === 'OPERATEUR') {
            status = StepStatus.A_VERIFIER;
        }

        await prisma.formStep.upsert({
            where: {
            formId_stepDefinitionId: {
                formId: form.id,
                stepDefinitionId: stepDefinition.id
            }
            },
            update: {
            status
            },
            create: {
            formId: form.id,
            stepDefinitionId: stepDefinition.id,
            status,
            }
        });
        createdSteps++;
        }
    }

    console.log(`✅ Migration terminée :`);
    console.log(` - ${createdForms} Forms créés/mis à jour`);
    console.log(` - ${createdSteps} FormSteps créés/mis à jour`);
}

migrateFormsProduction()
.catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});