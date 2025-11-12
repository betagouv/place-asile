/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Operateur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Operateur_name_key" ON "public"."Operateur"("name");
