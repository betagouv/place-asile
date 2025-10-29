/*
  Warnings:

  - A unique constraint covering the columns `[structureDnaCode,type]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_structureDnaCode_type_key" ON "public"."Contact"("structureDnaCode", "type");
