/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `FileUpload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileUpload_key_key" ON "FileUpload"("key");
