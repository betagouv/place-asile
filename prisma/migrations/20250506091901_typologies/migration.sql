/*
  Warnings:

  - You are about to drop the `Pmr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Typologie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pmr" DROP CONSTRAINT "Pmr_structureDnaCode_fkey";

-- DropForeignKey
ALTER TABLE "Typologie" DROP CONSTRAINT "Typologie_adresseId_fkey";

-- DropTable
DROP TABLE "Pmr";

-- DropTable
DROP TABLE "Typologie";

-- CreateTable
CREATE TABLE "AdresseTypologie" (
    "id" SERIAL NOT NULL,
    "adresseId" INTEGER NOT NULL,
    "nbPlacesTotal" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qpv" INTEGER NOT NULL,
    "logementSocial" INTEGER NOT NULL,

    CONSTRAINT "AdresseTypologie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureTypologie" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pmr" INTEGER NOT NULL,
    "lgbt" INTEGER NOT NULL,
    "fvvTeh" INTEGER NOT NULL,

    CONSTRAINT "StructureTypologie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdresseTypologie" ADD CONSTRAINT "AdresseTypologie_adresseId_fkey" FOREIGN KEY ("adresseId") REFERENCES "Adresse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureTypologie" ADD CONSTRAINT "StructureTypologie_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
