/*
  Warnings:

  - Added the required column `placesHorsDnaNg` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" ADD COLUMN     "placesHorsDnaNg" INTEGER NOT NULL;
