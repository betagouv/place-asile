/*
  Warnings:

  - You are about to drop the column `noteESSMS` on the `Evaluation` table. All the data in the column will be lost.
  - Added the required column `noteStructure` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "noteESSMS",
ADD COLUMN     "noteStructure" INTEGER NOT NULL;
