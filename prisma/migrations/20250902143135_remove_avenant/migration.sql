/*
  Warnings:

  - The values [ARRETE_AUTORISATION_AVENANT,CONVENTION_AVENANT,ARRETE_TARIFICATION_AVENANT,CPOM_AVENANT] on the enum `FileUploadCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."FileUploadCategory_new" AS ENUM ('BUDGET_PREVISIONNEL_DEMANDE', 'RAPPORT_BUDGETAIRE', 'BUDGET_PREVISIONNEL_RETENU', 'BUDGET_RECTIFICATIF', 'COMPTE_ADMINISTRATIF_SOUMIS', 'RAPPORT_ACTIVITE', 'COMPTE_ADMINISTRATIF_RETENU', 'DEMANDE_SUBVENTION', 'COMPTE_RENDU_FINANCIER', 'RAPPORT_ACTIVITE_OPERATEUR', 'ARRETE_AUTORISATION', 'CONVENTION', 'ARRETE_TARIFICATION', 'CPOM', 'INSPECTION_CONTROLE', 'AUTRE');
ALTER TABLE "public"."FileUpload" ALTER COLUMN "category" TYPE "public"."FileUploadCategory_new" USING ("category"::text::"public"."FileUploadCategory_new");
ALTER TYPE "public"."FileUploadCategory" RENAME TO "FileUploadCategory_old";
ALTER TYPE "public"."FileUploadCategory_new" RENAME TO "FileUploadCategory";
DROP TYPE "public"."FileUploadCategory_old";
COMMIT;
