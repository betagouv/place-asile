/*
  Warnings:

  - You are about to drop the column `fvv` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `nbPlacesLibres` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `nbPlacesVacantes` on the `Structure` table. All the data in the column will be lost.
  - You are about to drop the column `teh` on the `Structure` table. All the data in the column will be lost.
  - Added the required column `role` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fvvTeh` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Structure" DROP COLUMN "fvv",
DROP COLUMN "nbPlacesLibres",
DROP COLUMN "nbPlacesVacantes",
DROP COLUMN "teh",
ADD COLUMN     "fvvTeh" BOOLEAN NOT NULL;
