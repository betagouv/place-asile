-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "structureDnaCode" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_structureDnaCode_fkey" FOREIGN KEY ("structureDnaCode") REFERENCES "Structure"("dnaCode") ON DELETE RESTRICT ON UPDATE CASCADE;
