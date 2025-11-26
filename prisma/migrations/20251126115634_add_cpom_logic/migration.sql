-- AlterEnum
ALTER TYPE "public"."FileUploadCategory" ADD VALUE 'AUTRE_FINANCIER';

-- AlterEnum
ALTER TYPE "public"."Repartition" ADD VALUE 'NH';

-- AlterTable
ALTER TABLE "public"."FileUpload" ADD COLUMN     "cpomId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Cpom" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "debutCpom" TIMESTAMP(3) NOT NULL,
    "finCpom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cpom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CpomStructure" (
    "id" SERIAL NOT NULL,
    "cpomId" INTEGER NOT NULL,
    "structureId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "CpomStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CpomTypologie" (
    "id" SERIAL NOT NULL,
    "cpomId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cumulResultatNet" DOUBLE PRECISION,
    "repriseEtat" DOUBLE PRECISION,
    "affectationTotal" DOUBLE PRECISION,
    "affectationReserveInvestissement" DOUBLE PRECISION,
    "affectationChargesNonReproductibles" DOUBLE PRECISION,
    "affectationReserveCompensationDeficits" DOUBLE PRECISION,
    "affectationReserveCouvertureBFR" DOUBLE PRECISION,
    "affectationReserveCompensationAmortissements" DOUBLE PRECISION,
    "affectationFondsDedies" DOUBLE PRECISION,
    "affectationReportANouveau" DOUBLE PRECISION,
    "affectationAutre" DOUBLE PRECISION,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CpomTypologie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CpomTypologie_cpomId_date_key" ON "public"."CpomTypologie"("cpomId", "date");

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_cpomId_fkey" FOREIGN KEY ("cpomId") REFERENCES "public"."Cpom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomStructure" ADD CONSTRAINT "CpomStructure_cpomId_fkey" FOREIGN KEY ("cpomId") REFERENCES "public"."Cpom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomStructure" ADD CONSTRAINT "CpomStructure_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "public"."Structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CpomTypologie" ADD CONSTRAINT "CpomTypologie_cpomId_fkey" FOREIGN KEY ("cpomId") REFERENCES "public"."Cpom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
