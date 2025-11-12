-- AlterEnum
ALTER TYPE "public"."StructureType" ADD VALUE 'NH';

-- CreateTable
CREATE TABLE "public"."StructureOfii" (
    "id" SERIAL NOT NULL,
    "dnaCode" TEXT NOT NULL,
    "type" "public"."StructureType" NOT NULL,
    "nom" TEXT,
    "operateurId" INTEGER,
    "departementNumero" TEXT,
    "directionTerritoriale" TEXT,
    "nomOfii" TEXT,

    CONSTRAINT "StructureOfii_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StructureOfii_dnaCode_key" ON "public"."StructureOfii"("dnaCode");

-- AddForeignKey
ALTER TABLE "public"."StructureOfii" ADD CONSTRAINT "StructureOfii_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "public"."Operateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureOfii" ADD CONSTRAINT "StructureOfii_departementNumero_fkey" FOREIGN KEY ("departementNumero") REFERENCES "public"."Departement"("numero") ON DELETE SET NULL ON UPDATE CASCADE;
