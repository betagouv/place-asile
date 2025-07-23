import { Adresse, AdresseTypologie, Repartition } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";
import { createFakeAdresseTypologie } from "./adresse-typologie.seed";

export type AdresseWithTypologies = Adresse & {
  adresseTypologies: Omit<AdresseTypologie, "id" | "adresseId">[];
};

export const createFakeAdresses = (): Omit<
  AdresseWithTypologies,
  "id" | "structureDnaCode"
>[] => {
  const count = faker.number.int({ min: 1, max: 10 });
  return Array.from({ length: count }, createFakeAdresse);
};

export const createFakeAdresse = (): Omit<
  AdresseWithTypologies,
  "id" | "structureDnaCode"
> => {
  return {
    adresse: faker.location.streetAddress(),
    codePostal: faker.location.zipCode(),
    commune: faker.location.city(),
    repartition: faker.helpers.arrayElement([
      Repartition.DIFFUS,
      Repartition.COLLECTIF,
    ]),
    adresseTypologies: [
      createFakeAdresseTypologie({ year: 2025 }),
      createFakeAdresseTypologie({ year: 2024 }),
      createFakeAdresseTypologie({ year: 2023 }),
    ],
  };
};
