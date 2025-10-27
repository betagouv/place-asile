-- AlterEnum
ALTER TYPE "public"."FileUploadCategory" ADD VALUE 'EVALUATION';

-- AlterTable
ALTER TABLE "public"."Evaluation" ALTER COLUMN "notePersonne" DROP NOT NULL,
ALTER COLUMN "notePro" DROP NOT NULL,
ALTER COLUMN "noteStructure" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."FileUpload" ADD COLUMN     "evaluationId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "public"."Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
