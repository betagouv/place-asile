-- AlterEnum
ALTER TYPE "public"."StructureType"
ADD VALUE 'NH';
-- AlterTable
ALTER TABLE "public"."StructureOfii"
ADD COLUMN "directionTerritoriale" TEXT,
    ADD COLUMN "nomOfii" TEXT;