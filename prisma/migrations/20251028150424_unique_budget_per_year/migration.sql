/*
  Warnings:

  - A unique constraint covering the columns `[structureDnaCode,date]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_structureDnaCode_date_key" ON "public"."Budget"("structureDnaCode", "date");
