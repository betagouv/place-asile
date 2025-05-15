-- CreateEnum
CREATE TYPE "Repartition" AS ENUM ('DIFFUS', 'COLLECTIF', 'MIXTE');

-- CreateEnum
CREATE TYPE "ControleType" AS ENUM ('INOPINE', 'PROGRAMME');

-- CreateEnum
CREATE TYPE "PublicType" AS ENUM ('TOUT_PUBLIC', 'FAMILLE', 'PERSONNES_ISOLEES');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('CADA', 'HUDA', 'CPH', 'CAES', 'PRAHDA');

-- CreateTable
CREATE TABLE "Structure" (
    "id" SERIAL NOT NULL,
    "dnaCode" TEXT NOT NULL,
    "operateur" TEXT NOT NULL,
    "type" "StructureType" NOT NULL,
    "nbPlaces" INTEGER NOT NULL,
    "placesACreer" INTEGER,
    "placesAFermer" INTEGER,
    "echeancePlacesACreer" TIMESTAMP(3),
    "echeancePlacesAFermer" TIMESTAMP(3),
    "adresseAdministrative" TEXT NOT NULL,
    "codePostalAdministratif" TEXT NOT NULL,
    "communeAdministrative" TEXT NOT NULL,
    "departementAdministratif" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "nom" TEXT,
    "debutConvention" TIMESTAMP(3),
    "finConvention" TIMESTAMP(3),
    "cpom" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "finessCode" TEXT,
    "lgbt" BOOLEAN NOT NULL,
    "fvvTeh" BOOLEAN NOT NULL,
    "public" "PublicType" NOT NULL,
    "debutPeriodeAutorisation" TIMESTAMP(3),
    "finPeriodeAutorisation" TIMESTAMP(3),
    "debutCpom" TIMESTAMP(3),
    "finCpom" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Controle" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "ControleType" NOT NULL,

    CONSTRAINT "Controle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notePersonne" INTEGER NOT NULL,
    "notePro" INTEGER NOT NULL,
    "noteStructure" INTEGER NOT NULL,
    "note" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvenementIndesirableGrave" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "numeroDossier" TEXT NOT NULL,
    "evenementDate" TIMESTAMP(3) NOT NULL,
    "declarationDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "EvenementIndesirableGrave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adresse" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "repartition" "Repartition" NOT NULL,

    CONSTRAINT "Adresse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdresseTypologie" (
    "id" SERIAL NOT NULL,
    "adresseId" INTEGER NOT NULL,
    "nbPlacesTotal" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qpv" INTEGER NOT NULL,
    "logementSocial" INTEGER NOT NULL,

    CONSTRAINT "AdresseTypologie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureTypologie" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pmr" INTEGER NOT NULL,
    "lgbt" INTEGER NOT NULL,
    "fvvTeh" INTEGER NOT NULL,

    CONSTRAINT "StructureTypologie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activite" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nbPlaces" INTEGER NOT NULL,
    "desinsectisation" INTEGER NOT NULL,
    "remiseEnEtat" INTEGER NOT NULL,
    "sousOccupation" INTEGER NOT NULL,
    "travaux" INTEGER NOT NULL,
    "placesIndisponibles" INTEGER NOT NULL,
    "placesVacantes" INTEGER NOT NULL,
    "presencesInduesBPI" INTEGER NOT NULL,
    "presencesInduesDeboutees" INTEGER NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Structure_dnaCode_key" ON "Structure"("dnaCode");

-- AddForeignKey
ALTER TABLE "Controle" ADD CONSTRAINT "Controle_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenementIndesirableGrave" ADD CONSTRAINT "EvenementIndesirableGrave_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adresse" ADD CONSTRAINT "Adresse_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdresseTypologie" ADD CONSTRAINT "AdresseTypologie_adresseId_fkey" FOREIGN KEY ("adresseId") REFERENCES "Adresse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureTypologie" ADD CONSTRAINT "StructureTypologie_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activite" ADD CONSTRAINT "Activite_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE SET NULL ON UPDATE CASCADE;
