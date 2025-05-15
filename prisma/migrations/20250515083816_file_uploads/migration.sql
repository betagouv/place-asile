-- CreateTable
CREATE TABLE "FileUpload" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE SET NULL ON UPDATE CASCADE;
