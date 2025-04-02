/*
  Warnings:

  - Added the required column `placesIndisponibles` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" ADD COLUMN     "placesIndisponibles" INTEGER NOT NULL;
