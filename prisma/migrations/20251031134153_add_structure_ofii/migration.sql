-- CreateTable
CREATE TABLE "public"."StructureOfii" (
    "id" SERIAL NOT NULL,
    "dnaCode" TEXT NOT NULL,
    "type" "public"."StructureType" NOT NULL,
    "nom" TEXT,
    "operateurId" INTEGER,
    "departementId" INTEGER,

    CONSTRAINT "StructureOfii_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StructureOfii_dnaCode_key" ON "public"."StructureOfii"("dnaCode");

-- AddForeignKey
ALTER TABLE "public"."StructureOfii" ADD CONSTRAINT "StructureOfii_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "public"."Operateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StructureOfii" ADD CONSTRAINT "StructureOfii_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "public"."Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
