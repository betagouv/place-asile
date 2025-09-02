-- AlterTable
ALTER TABLE "FileUpload" ADD COLUMN     "parentFileUploadId" INTEGER;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_parentFileUploadId_fkey" FOREIGN KEY ("parentFileUploadId") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
