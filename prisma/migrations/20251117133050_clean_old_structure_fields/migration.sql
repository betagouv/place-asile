/*
  Warnings:

  - You are about to drop the column `oldNbPlaces` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `oldOperateur` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Structure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Structure" DROP COLUMN "oldNbPlaces",
DROP COLUMN "oldOperateur",
DROP COLUMN "state";

-- DropEnum
DROP TYPE "StructureState";
