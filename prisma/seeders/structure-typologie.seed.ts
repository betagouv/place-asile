import { fakerFR as faker } from "@faker-js/faker";

import { CURRENT_YEAR } from "@/constants";
import { StructureTypologie } from "@/generated/prisma/client";

export const createFakeStructureTypologie = ({
  placesAutorisees,
  year,
}: CreateFakeStructureTypologieOptions): Omit<
  StructureTypologie,
  "id" | "structureDnaCode"
> => {
  const lgbt = faker.number.int({ min: 0, max: placesAutorisees });

  return {
    date: null,
    year,
    pmr: faker.number.int({ min: 0, max: placesAutorisees }),
    lgbt,
    fvvTeh: faker.number.int({ min: 0, max: placesAutorisees - lgbt }),
    placesAutorisees,
    structureMillesimeId: null,
    placesACreer: faker.number.int({ min: 0, max: placesAutorisees }),
    placesAFermer: faker.number.int({ min: 0, max: placesAutorisees }),
    echeancePlacesACreer: faker.date.future({ years: year - CURRENT_YEAR }),
    echeancePlacesAFermer: faker.date.future({ years: year - CURRENT_YEAR }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

type CreateFakeStructureTypologieOptions = {
  placesAutorisees: number;
  year: number;
};
