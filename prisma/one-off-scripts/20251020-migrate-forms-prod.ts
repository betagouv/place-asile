// scripts/migrate-forms-prod.ts
import { AuthorType, PrismaClient, StepStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function migrateFormsProduction() {
    console.log('🚀 Début de la migration des Forms...');

    // Créer FormDefinition
    const formDefinition = await prisma.formDefinition.upsert({
        where: {
            name_version: {
                name: 'finalisation', // Première version finalisation structure par agent
                version: 1
            }
        },
        update: {},
        create: {
            name: 'finalisation',
            version: 1,
        }
    });

    console.log('✅ FormDefinition créée');

    // Créer les FormStepDefinitions
    const steps = [
        { label: '01-identification', authorType: AuthorType.OPERATEUR },
        { label: '02-adresses', authorType: AuthorType.OPERATEUR },
        { label: '03-finance', authorType: AuthorType.OPERATEUR },
        { label: '04-type-places', authorType: AuthorType.OPERATEUR },
        { label: '05-qualite', authorType: AuthorType.OPERATEUR },
        { label: '06-notes', authorType: AuthorType.OPERATEUR },
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