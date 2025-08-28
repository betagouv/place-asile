ALTER TABLE "Structure"
RENAME COLUMN "newOperateurId" TO "operateurId";

-- RenameForeignKey
ALTER TABLE "public"."Structure" RENAME CONSTRAINT "Structure_newOperateurId_fkey" TO "Structure_operateurId_fkey";