/*
  Warnings:

  - Added the required column `nbPlaces` to the `StructureTypologie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StructureTypologie" ADD COLUMN     "nbPlaces" INTEGER;
