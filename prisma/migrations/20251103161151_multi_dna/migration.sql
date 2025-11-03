/*
  Warnings:

  - A unique constraint covering the columns `[structureId,date]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codeDnaCode,type]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[structureId,formDefinitionId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CodeDnaType" AS ENUM ('PRINCIPAL', 'SECONDAIRE');

-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "Campaign_structureCodeDna_fkey";

-- AlterTable
ALTER TABLE "public"."Adresse" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Budget" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureCodeDna" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "codeDnaCode" TEXT,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Controle" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Evaluation" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."EvenementIndesirableGrave" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."FileUpload" ADD COLUMN     "structureId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureCodeDna" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."StructureTypologie" ADD COLUMN     "structureId" INTEGER,
ALTER COLUMN "structureDnaCode" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."CodeDna" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "structureId" INTEGER,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "adresseAdministrative" TEXT NOT NULL,
    "codePostalAdministratif" TEXT NOT NULL,
    "communeAdministrative" TEXT NOT NULL,
    "departementAdministratif" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "type" "public"."CodeDnaType" NOT NULL DEFAULT 'SECONDAIRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeDna_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodeDna_code_key" ON "public"."CodeDna"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_structureId_date_key" ON "public"."Budget"("structureId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_codeDnaCode_type_key" ON "public"."Contact"("codeDnaCode", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Form_structureId_formDefinitionId_key" ON "public"."Form"("structureId", "formDefinitionId");

-- AddForeignKey
ALTER TABLE "public"."CodeDna" ADD CONSTRAINT "CodeDna_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Controle" ADD CONSTRAINT "Controle_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluation" ADD CONSTRAINT "Evaluation_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EvenementIndesirableGrave" ADD CONSTRAINT "EvenementIndesirableGrave_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Adresse" ADD CONSTRAINT "Adresse_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_codeDnaCode_fkey" FOREIGN KEY ("codeDnaCode") REFERENCES "public"."CodeDna"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureTypologie" ADD CONSTRAINT "StructureTypologie_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
