import { fakerFR as faker } from "@faker-js/faker";

import { Activite } from "@/generated/prisma/client";

export const createFakeActivite = ({
  date,
}: CreateFakeActiviteArgs): Omit<Activite, "id" | "structureDnaCode"> => {
  const nbPlaces = faker.number.int({ min: 10, max: 200 });
  const desinsectisation = faker.number.int({ min: 1, max: nbPlaces / 4 });
  const remiseEnEtat = faker.number.int({ min: 1, max: nbPlaces / 4 });
  const sousOccupation = faker.number.int({ min: 1, max: nbPlaces / 4 });
  const travaux = faker.number.int({ min: 1, max: nbPlaces / 4 });
  const placesIndisponibles =
    desinsectisation + remiseEnEtat + sousOccupation + travaux;
  const placesVacantes = nbPlaces - placesIndisponibles;
  return {
    date,
    desinsectisation,
    nbPlaces,
    remiseEnEtat,
    sousOccupation,
    travaux,
    placesIndisponibles,
    placesVacantes,
    presencesInduesBPI: faker.number.int({ min: 1, max: 5 }),
    presencesInduesDeboutees: faker.number.int({
      min: 1,
      max: 5,
    }),
  };
};

type CreateFakeActiviteArgs = { date: Date };
