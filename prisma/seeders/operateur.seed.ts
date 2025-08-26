import { Operateur } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeOperateur = (): Omit<Operateur, "id"> => {
  // TODO : refacto pour éviter les conflits de nom
  const operateurs = Array.from(
    { length: 5 },
    (_, index) => `Opérateur ${index + 1}`
  );

  return {
    name: faker.helpers.arrayElement(operateurs),
  };
};
