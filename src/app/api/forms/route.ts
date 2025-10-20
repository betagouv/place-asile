import { PrismaClient, StepStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { structureDnaCode, formName, formVersion, stepLabel, status } = await request.json();

        // 1. Get FormDefinition and FormStepDefinition
        const formDefinition = await prisma.formDefinition.findUnique({
            where: {
                name_version: {
                    name: formName,
                    version: formVersion
                }
            }
        });

        if (!formDefinition) {
            return NextResponse.json({ error: 'FormDefinition non trouvée' }, { status: 404 });
        }

        const stepDefinition = await prisma.formStepDefinition.findFirst({
            where: {
                formDefinitionId: formDefinition.id,
                label: stepLabel
            }
        });

        if (!stepDefinition) {
            return NextResponse.json({ error: 'FormStepDefinition non trouvée' }, { status: 404 });
        }

        // 2. Create or update Form
        const form = await prisma.form.upsert({
            where: {
                structureCodeDna_formDefinitionId: {
                    structureCodeDna: structureDnaCode,
                    formDefinitionId: formDefinition.id
                }
            },
            update: {},
            create: {
                structureCodeDna: structureDnaCode,
                formDefinitionId: formDefinition.id,
                status: false,
            }
        });

        // 3. Create or update FormStep
        const formStep = await prisma.formStep.upsert({
            where: {
                formId_stepDefinitionId: {
                    formId: form.id,
                    stepDefinitionId: stepDefinition.id
                }
            },
            update: {
                status: status as StepStatus
            },
            create: {
                formId: form.id,
                stepDefinitionId: stepDefinition.id,
                status: status as StepStatus,
            }
        });

        return NextResponse.json({ success: true, formStep });
    } catch (error) {
        console.error('Erreur validation étape:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}