/*
  Warnings:

  - You are about to drop the column `placesOccupees` on the `Activite` table. All the data in the column will be lost.
  - Added the required column `placesVacantes` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" DROP COLUMN "placesOccupees",
ADD COLUMN     "placesVacantes" INTEGER NOT NULL;
