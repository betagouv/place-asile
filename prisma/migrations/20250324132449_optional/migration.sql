/*
  Warnings:

  - You are about to drop the column `cpomEnd` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `cpomStart` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `periodeAutorisationEnd` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `periodeAutorisationStart` on the `Structure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "cpomEnd",
DROP COLUMN "cpomStart",
DROP COLUMN "periodeAutorisationEnd",
DROP COLUMN "periodeAutorisationStart",
ADD COLUMN     "debutCpom" TIMESTAMP(3),
ADD COLUMN     "debutPeriodeAutorisation" TIMESTAMP(3),
ADD COLUMN     "finCpom" TIMESTAMP(3),
ADD COLUMN     "finPeriodeAutorisation" TIMESTAMP(3),
ALTER COLUMN "debutConvention" DROP NOT NULL,
ALTER COLUMN "finConvention" DROP NOT NULL,
ALTER COLUMN "finessCode" DROP NOT NULL;
