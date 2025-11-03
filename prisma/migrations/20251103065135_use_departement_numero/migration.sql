/*
  Warnings:

  - You are about to drop the column `departementId` on the `StructureOfii` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."StructureOfii" DROP CONSTRAINT "StructureOfii_departementId_fkey";

-- AlterTable
ALTER TABLE "public"."StructureOfii" DROP COLUMN "departementId",
ADD COLUMN     "departementNumero" TEXT;

-- AddForeignKey
ALTER TABLE "public"."StructureOfii" ADD CONSTRAINT "StructureOfii_departementNumero_fkey" FOREIGN KEY ("departementNumero") REFERENCES "public"."Departement"("numero") ON DELETE SET NULL ON UPDATE CASCADE;
