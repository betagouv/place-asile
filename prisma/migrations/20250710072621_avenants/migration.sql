-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileUploadCategory" ADD VALUE 'ARRETE_AUTORISATION_AVENANT';
ALTER TYPE "FileUploadCategory" ADD VALUE 'CONVENTION_AVENANT';
ALTER TYPE "FileUploadCategory" ADD VALUE 'ARRETE_TARIFICATION_AVENANT';
ALTER TYPE "FileUploadCategory" ADD VALUE 'CPOM_AVENANT';
ALTER TYPE "FileUploadCategory" ADD VALUE 'INSPECTION_CONTROLE';
