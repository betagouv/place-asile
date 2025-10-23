-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "reporting";

-- CreateEnum
CREATE TYPE "public"."AuthorType" AS ENUM ('OPERATEUR', 'AGENT');

-- CreateEnum
CREATE TYPE "public"."StepStatus" AS ENUM ('NON_COMMENCE', 'COMMENCE', 'A_VERIFIER', 'FINALISE', 'VALIDE');

-- CreateTable
CREATE TABLE "public"."FormDefinition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "FormDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormStepDefinition" (
    "id" SERIAL NOT NULL,
    "formDefinitionId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "authorType" "public"."AuthorType" NOT NULL,

    CONSTRAINT "FormStepDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Form" (
    "id" SERIAL NOT NULL,
    "structureCodeDna" TEXT NOT NULL,
    "formDefinitionId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormStep" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "stepDefinitionId" INTEGER NOT NULL,
    "status" "public"."StepStatus" NOT NULL DEFAULT 'NON_COMMENCE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "structureCodeDna" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "launched" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting"."Referential" (
    "dnaCode" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referential_pkey" PRIMARY KEY ("dnaCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_name_version_key" ON "public"."FormDefinition"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "FormStepDefinition_formDefinitionId_label_key" ON "public"."FormStepDefinition"("formDefinitionId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "Form_structureCodeDna_formDefinitionId_key" ON "public"."Form"("structureCodeDna", "formDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "FormStep_formId_stepDefinitionId_key" ON "public"."FormStep"("formId", "stepDefinitionId");

-- AddForeignKey
ALTER TABLE "public"."FormStepDefinition" ADD CONSTRAINT "FormStepDefinition_formDefinitionId_fkey" FOREIGN KEY ("formDefinitionId") REFERENCES "public"."FormDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_structureCodeDna_fkey" FOREIGN KEY ("structureCodeDna") REFERENCES "public"."Structure"("dnaCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_formDefinitionId_fkey" FOREIGN KEY ("formDefinitionId") REFERENCES "public"."FormDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormStep" ADD CONSTRAINT "FormStep_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormStep" ADD CONSTRAINT "FormStep_stepDefinitionId_fkey" FOREIGN KEY ("stepDefinitionId") REFERENCES "public"."FormStepDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_structureCodeDna_fkey" FOREIGN KEY ("structureCodeDna") REFERENCES "public"."Structure"("dnaCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporting"."Referential" ADD CONSTRAINT "Referential_dnaCode_fkey" FOREIGN KEY ("dnaCode") REFERENCES "public"."Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
