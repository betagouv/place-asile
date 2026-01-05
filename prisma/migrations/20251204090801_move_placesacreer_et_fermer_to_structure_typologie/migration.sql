/*
  Warnings:

  - A unique constraint covering the columns `[structureDnaCode,date]` on the table `StructureTypologie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."StructureTypologie" ADD COLUMN     "echeancePlacesACreer" TIMESTAMP(3),
ADD COLUMN     "echeancePlacesAFermer" TIMESTAMP(3),
ADD COLUMN     "placesACreer" INTEGER,
ADD COLUMN     "placesAFermer" INTEGER,
ALTER COLUMN "pmr" DROP NOT NULL,
ALTER COLUMN "lgbt" DROP NOT NULL,
ALTER COLUMN "fvvTeh" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StructureTypologie_structureDnaCode_date_key" ON "public"."StructureTypologie"("structureDnaCode", "date");
