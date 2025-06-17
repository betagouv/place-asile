/*
  Warnings:

  - You are about to drop the column `reserveInverstissement` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `reserveInvestissement` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "reserveInverstissement",
ADD COLUMN     "reserveInvestissement" INTEGER NOT NULL,
ALTER COLUMN "dotationAccordee" DROP NOT NULL,
ALTER COLUMN "totalProduits" DROP NOT NULL,
ALTER COLUMN "totalCharges" DROP NOT NULL,
ALTER COLUMN "cumulResultatsNetsCPOM" DROP NOT NULL,
ALTER COLUMN "repriseEtat" DROP NOT NULL;
