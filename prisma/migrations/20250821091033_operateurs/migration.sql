-- AlterTable
ALTER TABLE "public"."Structure" ADD COLUMN     "newOperateurId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Operateur" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Operateur_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Structure" ADD CONSTRAINT "Structure_newOperateurId_fkey" FOREIGN KEY ("newOperateurId") REFERENCES "public"."Operateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
