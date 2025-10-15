import { fakerFR as faker } from "@faker-js/faker";
import { AdresseTypologie } from "@prisma/client";

export const createFakeAdresseTypologie = ({
  year,
  placesAutorisees
}: CreateFakeAdresseTypologieOptions): Omit<
  AdresseTypologie,
  "id" | "adresseId"
> => {
  return {
    date: new Date(year, 0, 1, 13),
    placesAutorisees,
    qpv: faker.number.int({ min: 0, max: placesAutorisees / 5 }),
    logementSocial: faker.number.int({ min: 0, max: placesAutorisees / 5 }),
    createdAt: faker.date.past(),
    lastUpdate: faker.date.past(),
  };
};

type CreateFakeAdresseTypologieOptions = {
  placesAutorisees: number,
  year: number;
};
