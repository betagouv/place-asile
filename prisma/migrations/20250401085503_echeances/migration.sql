/*
  Warnings:

  - Added the required column `echeancePlacesACreer` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `echeancePlacesAFermer` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "echeancePlacesACreer" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "echeancePlacesAFermer" TIMESTAMP(3) NOT NULL;
