-- AlterTable
ALTER TABLE "Activite" ADD COLUMN     "placesOccupees" INTEGER,
ALTER COLUMN "desinsectisation" DROP NOT NULL,
ALTER COLUMN "remiseEnEtat" DROP NOT NULL,
ALTER COLUMN "sousOccupation" DROP NOT NULL,
ALTER COLUMN "travaux" DROP NOT NULL,
ALTER COLUMN "placesIndisponibles" DROP NOT NULL,
ALTER COLUMN "placesVacantes" DROP NOT NULL,
ALTER COLUMN "presencesInduesBPI" DROP NOT NULL,
ALTER COLUMN "presencesInduesDeboutees" DROP NOT NULL,
ALTER COLUMN "placesAutorisees" DROP NOT NULL;
