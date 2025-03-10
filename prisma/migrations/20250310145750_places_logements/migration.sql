/*
  Warnings:

  - Added the required column `noteESSMS` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notePersonne` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notePro` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbPlaces` to the `Logement` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `repartition` on the `Structure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Repartition" AS ENUM ('DIFFUS', 'COLLECTIF', 'MIXTE');

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "noteESSMS" INTEGER NOT NULL,
ADD COLUMN     "notePersonne" INTEGER NOT NULL,
ADD COLUMN     "notePro" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Logement" ADD COLUMN     "nbPlaces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "repartition",
ADD COLUMN     "repartition" "Repartition" NOT NULL;
