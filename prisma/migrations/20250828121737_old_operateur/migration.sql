/*
  Warnings:

  - You are about to drop the column `operateur` on the `Structure` table. All the data in the column will be lost.
  - Added the required column `oldOperateur` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Structure" 
RENAME COLUMN "operateur" TO "oldOperateur"
