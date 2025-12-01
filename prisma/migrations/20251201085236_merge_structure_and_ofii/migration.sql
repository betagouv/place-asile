-- AlterTable
ALTER TABLE "public"."Structure" ADD COLUMN     "activeInOfiiFileSince" TIMESTAMP(3),
ADD COLUMN     "directionTerritoriale" TEXT,
ADD COLUMN     "inactiveInOfiiFileSince" TIMESTAMP(3),
ADD COLUMN     "nomOfii" TEXT,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "adresseAdministrative" DROP NOT NULL,
ALTER COLUMN "codePostalAdministratif" DROP NOT NULL,
ALTER COLUMN "communeAdministrative" DROP NOT NULL,
ALTER COLUMN "departementAdministratif" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "cpom" DROP NOT NULL,
ALTER COLUMN "creationDate" DROP NOT NULL,
ALTER COLUMN "lgbt" DROP NOT NULL,
ALTER COLUMN "fvvTeh" DROP NOT NULL,
ALTER COLUMN "public" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Structure" ADD CONSTRAINT "Structure_departementAdministratif_fkey" FOREIGN KEY ("departementAdministratif") REFERENCES "public"."Departement"("numero") ON DELETE SET NULL ON UPDATE CASCADE;
