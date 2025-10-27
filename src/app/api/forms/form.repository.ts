import prisma from "@/lib/prisma";
import { FormApiType } from "@/schemas/api/form.schema";
import { StepStatus } from "@/types/form.type";

import { convertToStepStatus } from "./form.util";

export const createOrUpdateForms = async (
  forms: FormApiType[] | undefined,
  structureCodeDna: string
): Promise<void> => {
  if (!forms || forms.length === 0) return;

  await Promise.all(
    forms.map(async (form) => {
      await createCompleteFormWithSteps(structureCodeDna, form);
    })
  );
};

const createCompleteFormWithSteps = async (
  structureCodeDna: string,
  form: FormApiType
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    // 1. Récupérer la FormDefinition par slug
    const formDefinition = await tx.formDefinition.findUnique({
      where: { slug: form.formDefinition.slug },
      include: { stepsDefinition: true },
    });

    if (!formDefinition) {
      throw new Error(
        `FormDefinition with slug ${form.formDefinition.slug} not found`
      );
    }

    // 2. Créer ou mettre à jour le Form
    const formEntity = await tx.form.upsert({
      where: {
        structureCodeDna_formDefinitionId: {
          structureCodeDna: structureCodeDna,
          formDefinitionId: formDefinition.id,
        },
      },
      update: {
        status: form.status,
      },
      create: {
        formDefinitionId: formDefinition.id,
        structureCodeDna: structureCodeDna,
        status: form.status,
      },
    });

    // 3. Créer ou mettre à jour les FormSteps
    if (form.formSteps) {
      await Promise.all(
        form.formSteps.map(async (step) => {
          // 3.1. Récupérer le stepDefinition par slug
          const stepDefinition = formDefinition.stepsDefinition.find(
            (stepDefinition) => stepDefinition.slug === step.stepDefinition.slug
          );
          if (!stepDefinition) {
            throw new Error(
              `stepDefinition with slug ${step.stepDefinition.slug} not found`
            );
          }

          // 3.2. Créer ou mettre à jour le FormStep
          await tx.formStep.upsert({
            where: {
              formId_stepDefinitionId: {
                formId: formEntity.id,
                stepDefinitionId: stepDefinition.id,
              },
            },
            update: {
              status: convertToStepStatus(step.status),
            },
            create: {
              formId: formEntity.id,
              stepDefinitionId: stepDefinition.id,
              status: convertToStepStatus(step.status),
            },
          });
        })
      );
    }
  });
};

export const initializeDefaultForms = async (
  structureCodeDna: string
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const formDefinition = await tx.formDefinition.findUnique({
      where: { slug: "finalisation-v1" },
      include: { stepsDefinition: true },
    });

    if (!formDefinition) {
      throw new Error("FormDefinition with slug finalisation-v1 not found");
    }

    const formEntity = await tx.form.create({
      data: {
        formDefinitionId: formDefinition.id,
        structureCodeDna: structureCodeDna,
        status: false
      },
    });

    for (const stepDefinition of formDefinition.stepsDefinition) {
      let status: StepStatus = StepStatus.NON_COMMENCE;

      // Les deux premières étapes sont marquées "À vérifier"
      if (
        stepDefinition.slug === "01-identification" ||
        stepDefinition.slug === "02-documents-financiers"
      ) {
        status = StepStatus.A_VERIFIER;
      }

      await tx.formStep.create({
        data: {
          formId: formEntity.id,
          stepDefinitionId: stepDefinition.id,
          status: status,
        },
      });
    }
  }
  )
};
