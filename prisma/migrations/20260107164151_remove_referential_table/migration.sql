/*
  Warnings:

  - You are about to drop the `Referential` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reporting"."Referential" DROP CONSTRAINT "Referential_dnaCode_fkey";

-- DropIndex
DROP INDEX "StructureTypologie_structureDnaCode_date_key";

-- DropTable
DROP TABLE "reporting"."Referential";
