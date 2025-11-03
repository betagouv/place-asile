import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient, StructureTypologie } from "@prisma/client";

export const createFakeStructureTypologie = ({
  placesAutorisees,
  year,
}: CreateFakeStructureTypologieOptions): Omit<
  StructureTypologie,
  "id" | "structureId" | "structureDnaCode"
> => {
  const lgbt = faker.number.int({ min: 0, max: placesAutorisees })

  return {
    date: new Date(year, 0, 1, 13),
    pmr: faker.number.int({ min: 0, max: placesAutorisees }),
    lgbt,
    fvvTeh: faker.number.int({ min: 0, max: placesAutorisees - lgbt }),
    placesAutorisees,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

export async function insertStructureTypologies(
  prisma: PrismaClient,
  structureId: number,
  structureTypologies: Omit<StructureTypologie, "id" | "structureId">[]
): Promise<void> {
  for (const t of structureTypologies || []) {
    await prisma.structureTypologie.create({
      data: {
        structureId,
        date: t.date,
        placesAutorisees: t.placesAutorisees,
        pmr: t.pmr,
        lgbt: t.lgbt,
        fvvTeh: t.fvvTeh,
      },
    });
  }
}

type CreateFakeStructureTypologieOptions = {
  placesAutorisees: number;
  year: number;
};
