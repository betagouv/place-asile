/*
  Warnings:

  - A unique constraint covering the columns `[adresseId,year]` on the table `AdresseTypologie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpomId,year]` on the table `CpomMillesime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `StructureMillesime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `StructureTypologie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AdresseTypologie" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cpom" ADD COLUMN     "yearEnd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yearStart" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "debutCpom" DROP NOT NULL,
ALTER COLUMN "finCpom" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CpomMillesime" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CpomStructure" ADD COLUMN     "yearEnd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yearStart" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StructureMillesime" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StructureTypologie" ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdresseTypologie_adresseId_year_key" ON "AdresseTypologie"("adresseId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_structureDnaCode_year_key" ON "Budget"("structureDnaCode", "year");

-- CreateIndex
CREATE UNIQUE INDEX "CpomMillesime_cpomId_year_key" ON "CpomMillesime"("cpomId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "StructureMillesime_structureDnaCode_year_key" ON "StructureMillesime"("structureDnaCode", "year");

-- CreateIndex
CREATE UNIQUE INDEX "StructureTypologie_structureDnaCode_year_key" ON "StructureTypologie"("structureDnaCode", "year");
