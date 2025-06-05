/*
  Warnings:

  - The `category` column on the `FileUpload` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FileUploadCategory" AS ENUM ('BUDGET_PREVISIONNEL_DEMANDE', 'RAPPORT_BUDGETAIRE', 'BUDGET_PREVISIONNEL_RETENU', 'BUDGET_RECTIFICATIF', 'COMPTE_ADMINISTRATIF_SOUMIS', 'RAPPORT_ACTIVITE', 'COMPTE_ADMINISTRATIF_RETENU', 'DEMANDE_SUBVENTION', 'COMPTE_RENDU_FINANCIER', 'RAPPORT_ACTIVITE_OPERATEUR');

-- AlterTable
ALTER TABLE "FileUpload" DROP COLUMN "category",
ADD COLUMN     "category" "FileUploadCategory";
