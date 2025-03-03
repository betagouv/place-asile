import { PrismaClient } from "@prisma/client";
import { extractFromXslx } from "../scripts/extract-from-xlsx.js";
import { StructureWithCoordinates } from "@/types/structure.type.js";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  const structures = await extractFromXslx(false);
  for (const structure of structures) {
    const sanitizedStructure = {
      ...structure,
      codePostalHebergement: structure.codePostalHebergement.toString(),
    };
    await prisma.structure.create({
      data: sanitizedStructure as StructureWithCoordinates,
    });
  }
}

seed();
