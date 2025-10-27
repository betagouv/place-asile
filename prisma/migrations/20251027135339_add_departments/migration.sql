-- CreateTable
CREATE TABLE "public"."Departement" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Departement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departement_numero_key" ON "public"."Departement"("numero");
