-- CreateEnum
CREATE TYPE "StructureState" AS ENUM ('A_FINALISER', 'FINALISE');

-- AlterTable
ALTER TABLE "Structure" ADD COLUMN     "state" "StructureState" NOT NULL DEFAULT 'A_FINALISER';
