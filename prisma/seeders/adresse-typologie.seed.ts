import { AdresseTypologie } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeAdresseTypologie = ({
  year,
}: CreateFakeAdresseTypologieOptions): Omit<
  AdresseTypologie,
  "id" | "adresseId"
> => {
  const placesAutorisees = faker.number.int({ min: 0, max: 100 });

  return {
    date: new Date(year, 0, 1, 13),
    placesAutorisees,
    qpv: faker.number.int({ min: 0, max: placesAutorisees }),
    logementSocial: faker.number.int({ min: 0, max: placesAutorisees }),
  };
};

type CreateFakeAdresseTypologieOptions = {
  year: number;
};
