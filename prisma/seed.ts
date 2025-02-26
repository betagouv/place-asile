import { PrismaClient } from "@prisma/client";
import { extractFromXslx } from "../scripts/extract-from-xlsx.js";
import { CentreWithCoordinates } from "@/types/centre.type.js";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  const centres = await extractFromXslx(false);
  for (const centre of centres) {
    const sanitizedCentre = {
      ...centre,
      codePostalHebergement: centre.codePostalHebergement.toString(),
    };
    await prisma.structure.create({
      data: sanitizedCentre as CentreWithCoordinates,
    });
  }
}

seed();
