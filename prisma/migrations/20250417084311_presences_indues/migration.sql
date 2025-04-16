/*
  Warnings:

  - You are about to drop the column `placesInduesBPI` on the `Activite` table. All the data in the column will be lost.
  - You are about to drop the column `placesInduesDeboutees` on the `Activite` table. All the data in the column will be lost.
  - Added the required column `presencesInduesBPI` to the `Activite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presencesInduesDeboutees` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" DROP COLUMN "placesInduesBPI",
DROP COLUMN "placesInduesDeboutees",
ADD COLUMN     "presencesInduesBPI" INTEGER NOT NULL,
ADD COLUMN     "presencesInduesDeboutees" INTEGER NOT NULL;
