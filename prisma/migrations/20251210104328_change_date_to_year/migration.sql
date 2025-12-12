/*
  Warnings:

  - You are about to drop the column `date` on the `AdresseTypologie` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `CpomMillesime` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `StructureMillesime` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `StructureTypologie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpomId,year]` on the table `CpomMillesime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureDnaCode,year]` on the table `StructureMillesime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `AdresseTypologie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Budget` table without a default value. This is not possible if the table is not empty.
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
ALTER TABLE "public"."AdresseTypologie" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Budget" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."CpomMillesime" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."StructureMillesime" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."StructureTypologie" DROP COLUMN "date",
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_structureDnaCode_year_key" ON "public"."Budget"("structureDnaCode", "year");

-- CreateIndex
CREATE UNIQUE INDEX "CpomMillesime_cpomId_year_key" ON "public"."CpomMillesime"("cpomId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "StructureMillesime_structureDnaCode_year_key" ON "public"."StructureMillesime"("structureDnaCode", "year");
