import { PrismaClient } from "@prisma/client";
import centres from "../scripts/export.json";

const prisma = new PrismaClient();

export async function seed() {
  for (const centre of centres) {
    const sanitizedCentre = {
      ...centre,
      codePostalHebergement: centre.codePostalHebergement.toString(),
    };
    await prisma.structure.create({ data: sanitizedCentre });
  }
}

seed();
