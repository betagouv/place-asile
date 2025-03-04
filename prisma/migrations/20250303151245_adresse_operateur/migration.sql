/*
  Warnings:

  - Added the required column `adresseOperateur` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "adresseOperateur" TEXT NOT NULL;
