/*
  Warnings:

  - You are about to drop the column `nbPlaces` on the `Activite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[structureDnaCode,date]` on the table `Activite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placesAutorisees` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" DROP COLUMN "nbPlaces",
ADD COLUMN     "placesAutorisees" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Activite_structureDnaCode_date_key" ON "Activite"("structureDnaCode", "date");
