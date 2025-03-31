/*
  Warnings:

  - Added the required column `placesACreer` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placesAFermer` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fvvTeh` to the `Typologie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lgbt` to the `Typologie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "placesACreer" INTEGER NOT NULL,
ADD COLUMN     "placesAFermer" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Typologie" ADD COLUMN     "fvvTeh" INTEGER NOT NULL,
ADD COLUMN     "lgbt" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Activite" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nbPlaces" INTEGER NOT NULL,
    "desinsectisation" INTEGER NOT NULL,
    "remiseEnEtat" INTEGER NOT NULL,
    "sousOccupation" INTEGER NOT NULL,
    "travaux" INTEGER NOT NULL,
    "placesOccupees" INTEGER NOT NULL,
    "placesPIBPI" INTEGER NOT NULL,
    "placesPIdeboutees" INTEGER NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activite" ADD CONSTRAINT "Activite_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
