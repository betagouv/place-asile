/*
  Warnings:

  - A unique constraint covering the columns `[adresseId,year]` on the table `AdresseTypologie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpomId,year]` on the table `CpomMillesime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `StructureMillesime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `StructureTypologie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `AdresseTypologie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearEnd` to the `Cpom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearStart` to the `Cpom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `CpomMillesime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `StructureMillesime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `StructureTypologie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Budget_structureDnaCode_date_key";

-- DropIndex
DROP INDEX "CpomMillesime_cpomId_date_key";

-- DropIndex
DROP INDEX "StructureMillesime_structureDnaCode_date_key";

-- AlterTable
ALTER TABLE "AdresseTypologie" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Cpom" ADD COLUMN     "yearEnd" INTEGER NOT NULL,
ADD COLUMN     "yearStart" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CpomMillesime" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CpomStructure" ADD COLUMN     "yearEnd" INTEGER,
ADD COLUMN     "yearStart" INTEGER;

-- AlterTable
ALTER TABLE "StructureMillesime" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StructureTypologie" ADD COLUMN     "year" INTEGER NOT NULL;

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
