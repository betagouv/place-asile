import { PrismaClient } from "@prisma/client";
import { extractFromXslx } from "../scripts/extract-from-xlsx.js";
import { StructureWithLatLng } from "@/types/structure.type.js";

const prisma = new PrismaClient();

const wipeStructureTable = async () => {
  await prisma.structure.deleteMany({});
};

export async function seed(): Promise<void> {
  const structures = await extractFromXslx(false);
  await wipeStructureTable();
  for (const structure of structures) {
    const sanitizedStructure = {
      ...structure,
      codePostalHebergement: structure.codePostalHebergement.toString(),
    };
    await prisma.structure.create({
      data: sanitizedStructure as StructureWithLatLng,
    });
  }
}

seed();
