/*
  Warnings:

  - Made the column `year` on table `AdresseTypologie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearEnd` on table `Cpom` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearStart` on table `Cpom` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `CpomMillesime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearEnd` on table `CpomStructure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearStart` on table `CpomStructure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `StructureMillesime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `StructureTypologie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AdresseTypologie" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Cpom" ALTER COLUMN "debutCpom" DROP NOT NULL,
ALTER COLUMN "finCpom" DROP NOT NULL,
ALTER COLUMN "yearEnd" SET NOT NULL,
ALTER COLUMN "yearEnd" SET DEFAULT 0,
ALTER COLUMN "yearStart" SET NOT NULL,
ALTER COLUMN "yearStart" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CpomMillesime" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CpomStructure" ALTER COLUMN "yearEnd" SET NOT NULL,
ALTER COLUMN "yearEnd" SET DEFAULT 0,
ALTER COLUMN "yearStart" SET NOT NULL,
ALTER COLUMN "yearStart" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "StructureMillesime" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "StructureTypologie" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "year" SET DEFAULT 0;
