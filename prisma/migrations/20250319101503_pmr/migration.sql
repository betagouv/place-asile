/*
  Warnings:

  - You are about to drop the column `adresse` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `codePostal` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `commune` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `departement` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `qpv` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `repartition` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the `Logement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adresseAdministrative` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostalAdministratif` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communeAdministrative` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departementAdministratif` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Structure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `public` on the `Structure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PublicType" AS ENUM ('TOUT_PUBLIC', 'FAMILLE', 'PERSONNES_ISOLEES');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('CADA', 'HUDA', 'CPH', 'CAES', 'PRAHDA');

-- DropForeignKey
ALTER TABLE "Logement" DROP CONSTRAINT "Logement_structureDnaCode_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_structureDnaCode_fkey";

-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "adresse",
DROP COLUMN "codePostal",
DROP COLUMN "commune",
DROP COLUMN "departement",
DROP COLUMN "qpv",
DROP COLUMN "repartition",
ADD COLUMN     "adresseAdministrative" TEXT NOT NULL,
ADD COLUMN     "codePostalAdministratif" TEXT NOT NULL,
ADD COLUMN     "communeAdministrative" TEXT NOT NULL,
ADD COLUMN     "departementAdministratif" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "StructureType" NOT NULL,
DROP COLUMN "public",
ADD COLUMN     "public" "PublicType" NOT NULL;

-- DropTable
DROP TABLE "Logement";

-- DropTable
DROP TABLE "Place";

-- CreateTable
CREATE TABLE "Adresse" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "repartition" "Repartition" NOT NULL,

    CONSTRAINT "Adresse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typologie" (
    "id" SERIAL NOT NULL,
    "adresseId" INTEGER NOT NULL,
    "nbPlacesTotal" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qpv" INTEGER NOT NULL,
    "logementSocial" INTEGER NOT NULL,

    CONSTRAINT "Typologie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pmr" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nbPlaces" INTEGER NOT NULL,

    CONSTRAINT "Pmr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adresse" ADD CONSTRAINT "Adresse_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Typologie" ADD CONSTRAINT "Typologie_adresseId_fkey" FOREIGN KEY ("adresseId") REFERENCES "Adresse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pmr" ADD CONSTRAINT "Pmr_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
