import { AdresseTypologie } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeAdresseTypologie = ({
  year,
}: CreateFakeAdresseTypologieOptions): Omit<
  AdresseTypologie,
  "id" | "adresseId"
> => {
  const nbPlacesTotal = faker.number.int({ min: 0, max: 100 });

  return {
    date: new Date(year, 0, 1, 13),
    nbPlacesTotal,
    qpv: faker.number.int({ min: 0, max: nbPlacesTotal }),
    logementSocial: faker.number.int({ min: 0, max: nbPlacesTotal }),
  };
};

type CreateFakeAdresseTypologieOptions = {
  year: number;
};
