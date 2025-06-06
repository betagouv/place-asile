-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ETP" INTEGER NOT NULL,
    "tauxEncadrement" INTEGER NOT NULL,
    "coutJournalier" INTEGER NOT NULL,
    "dotationDemandee" INTEGER NOT NULL,
    "dotationAccordee" INTEGER NOT NULL,
    "totalProduits" INTEGER NOT NULL,
    "totalCharges" INTEGER NOT NULL,
    "cumulResultatsNetsCPOM" INTEGER NOT NULL,
    "repriseEtat" INTEGER NOT NULL,
    "reserveInverstissement" INTEGER NOT NULL,
    "chargesNonReconductibles" INTEGER NOT NULL,
    "reserveCompensationDeficits" INTEGER NOT NULL,
    "reserveCompensationBFR" INTEGER NOT NULL,
    "reserveCompensationAmortissements" INTEGER NOT NULL,
    "fondsDedies" INTEGER NOT NULL,
    "commentaire" TEXT,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
