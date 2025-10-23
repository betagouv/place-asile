-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "ETP" DROP NOT NULL,
ALTER COLUMN "tauxEncadrement" DROP NOT NULL,
ALTER COLUMN "coutJournalier" DROP NOT NULL;
