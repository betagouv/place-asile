import { fakerFR as faker } from "@faker-js/faker";

import { Activite } from "@/generated/prisma/client";

export const createFakeActivite = ({
  date,
}: CreateFakeActiviteArgs): Omit<Activite, "id" | "structureDnaCode"> => {
  return {
    date,
    desinsectisation: faker.number.int({ min: 1, max: 10 }),
    nbPlaces: faker.number.int({ min: 1, max: 10 }),
    placesIndisponibles: faker.number.int({ min: 1, max: 10 }),
    placesVacantes: faker.number.int({ min: 1, max: 10 }),
    presencesInduesBPI: faker.number.int({ min: 1, max: 10 }),
    presencesInduesDeboutees: faker.number.int({ min: 1, max: 10 }),
    remiseEnEtat: faker.number.int({ min: 1, max: 10 }),
    sousOccupation: faker.number.int({ min: 1, max: 10 }),
    travaux: faker.number.int({ min: 1, max: 10 }),
  };
};

type CreateFakeActiviteArgs = { date: Date };
