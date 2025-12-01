/*
  Warnings:

  - A unique constraint covering the columns `[structureMillesimeId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureMillesimeId]` on the table `StructureTypologie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."FileUploadGranularity" AS ENUM ('STRUCTURE', 'CPOM', 'STRUCTURE_ET_CPOM');

-- AlterEnum
ALTER TYPE "public"."FileUploadCategory" ADD VALUE 'AUTRE_FINANCIER';

-- AlterTable
ALTER TABLE "public"."Budget" ADD COLUMN     "structureMillesimeId" INTEGER;

-- AlterTable
ALTER TABLE "public"."FileUpload" ADD COLUMN     "granularity" "public"."FileUploadGranularity" NOT NULL DEFAULT 'STRUCTURE';

-- AlterTable
ALTER TABLE "public"."StructureTypologie" ADD COLUMN     "structureMillesimeId" INTEGER;

-- CreateTable
CREATE TABLE "public"."StructureMillesime" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cpom" BOOLEAN NOT NULL DEFAULT false,
    "operateurComment" TEXT,
    "structureTypologieId" INTEGER,
    "budgetId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StructureMillesime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cpom" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "debutCpom" TIMESTAMP(3) NOT NULL,
    "finCpom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cpom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CpomStructure" (
    "id" SERIAL NOT NULL,
    "cpomId" INTEGER NOT NULL,
    "structureId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CpomStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CpomMillesime" (
    "id" SERIAL NOT NULL,
    "cpomId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cumulResultatNet" DOUBLE PRECISION,
    "repriseEtat" DOUBLE PRECISION,
    "affectationTotal" DOUBLE PRECISION,
    "affectationReserveInvestissement" DOUBLE PRECISION,
    "affectationChargesNonReproductibles" DOUBLE PRECISION,
    "affectationReserveCompensationDeficits" DOUBLE PRECISION,
    "affectationReserveCouvertureBFR" DOUBLE PRECISION,
    "affectationReserveCompensationAmortissements" DOUBLE PRECISION,
    "affectationFondsDedies" DOUBLE PRECISION,
    "affectationReportANouveau" DOUBLE PRECISION,
    "affectationAutre" DOUBLE PRECISION,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CpomMillesime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StructureMillesime_structureDnaCode_date_key" ON "public"."StructureMillesime"("structureDnaCode", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CpomStructure_cpomId_structureId_key" ON "public"."CpomStructure"("cpomId", "structureId");

-- CreateIndex
CREATE UNIQUE INDEX "CpomMillesime_cpomId_date_key" ON "public"."CpomMillesime"("cpomId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_structureMillesimeId_key" ON "public"."Budget"("structureMillesimeId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureTypologie_structureMillesimeId_key" ON "public"."StructureTypologie"("structureMillesimeId");

-- AddForeignKey
ALTER TABLE "public"."StructureMillesime" ADD CONSTRAINT "StructureMillesime_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "public"."Structure"("dnaCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureTypologie" ADD CONSTRAINT "StructureTypologie_structureMillesimeId_fkey" FOREIGN KEY ("structureMillesimeId") REFERENCES "public"."StructureMillesime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_structureMillesimeId_fkey" FOREIGN KEY ("structureMillesimeId") REFERENCES "public"."StructureMillesime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomStructure" ADD CONSTRAINT "CpomStructure_cpomId_fkey" FOREIGN KEY ("cpomId") REFERENCES "public"."Cpom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomStructure" ADD CONSTRAINT "CpomStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomMillesime" ADD CONSTRAINT "CpomMillesime_cpomId_fkey" FOREIGN KEY ("cpomId") REFERENCES "public"."Cpom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
