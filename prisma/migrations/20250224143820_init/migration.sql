-- CreateTable
CREATE TABLE "Structure" (
    "id" SERIAL NOT NULL,
    "operateur" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nbPlaces" INTEGER NOT NULL,
    "adresseHebergement" TEXT NOT NULL,
    "codePostalHebergement" TEXT NOT NULL,
    "communeHebergement" TEXT NOT NULL,
    "nbHebergements" INTEGER NOT NULL,
    "typologie" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);
