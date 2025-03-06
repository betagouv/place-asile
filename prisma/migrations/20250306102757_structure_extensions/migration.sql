/*
  Warnings:

  - You are about to drop the column `adresseHebergement` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `adresseOperateur` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `codePostalHebergement` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `communeHebergement` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `nbHebergements` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `typologie` on the `Structure` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dnaCode]` on the table `Structure` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adresse` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commune` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpom` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpomEnd` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpomStart` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationDate` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debutConvention` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departement` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dnaCode` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finConvention` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finessCode` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fvv` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lgbt` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbPlacesLibres` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbPlacesVacantes` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodeAutorisationEnd` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodeAutorisationStart` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qpv` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repartition` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teh` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ControleType" AS ENUM ('INOPINE', 'PROGRAMME');

-- CreateEnum
CREATE TYPE "EvenementIndesirableGraveType" AS ENUM ('VOL', 'COMPORTEMENT_VIOLENT', 'PROBLEME_RH');

-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "adresseHebergement",
DROP COLUMN "adresseOperateur",
DROP COLUMN "codePostalHebergement",
DROP COLUMN "communeHebergement",
DROP COLUMN "nbHebergements",
DROP COLUMN "typologie",
ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "commune" TEXT NOT NULL,
ADD COLUMN     "cpom" BOOLEAN NOT NULL,
ADD COLUMN     "cpomEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cpomStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "debutConvention" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "departement" TEXT NOT NULL,
ADD COLUMN     "dnaCode" TEXT NOT NULL,
ADD COLUMN     "finConvention" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "finessCode" TEXT NOT NULL,
ADD COLUMN     "fvv" BOOLEAN NOT NULL,
ADD COLUMN     "lgbt" BOOLEAN NOT NULL,
ADD COLUMN     "nbPlacesLibres" INTEGER NOT NULL,
ADD COLUMN     "nbPlacesVacantes" INTEGER NOT NULL,
ADD COLUMN     "nom" TEXT,
ADD COLUMN     "periodeAutorisationEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodeAutorisationStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "public" TEXT NOT NULL,
ADD COLUMN     "qpv" BOOLEAN NOT NULL,
ADD COLUMN     "repartition" TEXT NOT NULL,
ADD COLUMN     "teh" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Controle" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "ControleType" NOT NULL,

    CONSTRAINT "Controle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvenementIndesirableGrave" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "numeroDossier" TEXT NOT NULL,
    "evenementDate" TIMESTAMP(3) NOT NULL,
    "declarationDate" TIMESTAMP(3) NOT NULL,
    "type" "EvenementIndesirableGraveType" NOT NULL,

    CONSTRAINT "EvenementIndesirableGrave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logement" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "qpv" BOOLEAN NOT NULL,
    "logementSocial" BOOLEAN NOT NULL,

    CONSTRAINT "Logement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "nbPlacesTotal" INTEGER NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "pmr" INTEGER NOT NULL,
    "qpv" INTEGER NOT NULL,
    "logementSocial" INTEGER NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Structure_dnaCode_key" ON "Structure"("dnaCode");

-- AddForeignKey
ALTER TABLE "Controle" ADD CONSTRAINT "Controle_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenementIndesirableGrave" ADD CONSTRAINT "EvenementIndesirableGrave_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logement" ADD CONSTRAINT "Logement_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
