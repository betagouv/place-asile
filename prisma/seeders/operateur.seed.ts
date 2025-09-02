import { fakerFR as faker } from "@faker-js/faker";
import { Operateur } from "@prisma/client";

export const createFakeOperateur = (index: number): Omit<Operateur, "id"> => {
  const operateurs = Array.from(
    { length: 5 },
    () => `Opérateur ${index + 1}`
  );

  return {
    name: faker.helpers.arrayElement(operateurs),
  };
};
