-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_parentFileUploadId_fkey";

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_parentFileUploadId_fkey" FOREIGN KEY ("parentFileUploadId") REFERENCES "public"."FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
