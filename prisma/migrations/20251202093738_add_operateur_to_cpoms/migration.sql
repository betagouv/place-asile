/*
  Warnings:

  - Added the required column `operateurId` to the `Cpom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cpom" ADD COLUMN     "operateurId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Cpom" ADD CONSTRAINT "Cpom_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "public"."Operateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
