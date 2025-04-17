/*
  Warnings:

  - You are about to drop the column `placesHorsDnaNg` on the `Activite` table. All the data in the column will be lost.
  - You are about to drop the column `placesPIBPI` on the `Activite` table. All the data in the column will be lost.
  - You are about to drop the column `placesPIdeboutees` on the `Activite` table. All the data in the column will be lost.
  - Added the required column `placesInduesBPI` to the `Activite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placesInduesDeboutees` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" DROP COLUMN "placesHorsDnaNg",
DROP COLUMN "placesPIBPI",
DROP COLUMN "placesPIdeboutees",
ADD COLUMN     "placesInduesBPI" INTEGER NOT NULL,
ADD COLUMN     "placesInduesDeboutees" INTEGER NOT NULL;
