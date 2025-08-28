import { StructureTypologie } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeStructureTypologie = ({
  year,
}: CreateFakeStructureTypologieOptions): Omit<
  StructureTypologie,
  "id" | "structureDnaCode"
> => {
  const placesAutorisees = faker.number.int({ min: 0, max: 100 });

  return {
    date: new Date(year, 0, 1, 13),
    pmr: faker.number.int({ min: 0, max: placesAutorisees }),
    lgbt: faker.number.int({ min: 0, max: placesAutorisees }),
    fvvTeh: faker.number.int({ min: 0, max: placesAutorisees }),
    placesAutorisees,
  };
};

type CreateFakeStructureTypologieOptions = {
  year: number;
};
