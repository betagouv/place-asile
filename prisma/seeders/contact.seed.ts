import { Contact } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

export const createFakeContact = (): Omit<
  Contact,
  "id" | "structureDnaCode"
> => {
  const prenom = faker.person.firstName();
  const nom = faker.person.lastName();

  return {
    prenom,
    nom,
    telephone: faker.phone.number(),
    email: faker.internet.email({ firstName: prenom, lastName: nom }),
    role: faker.helpers.arrayElement(["Directeur", "Contact"]),
  };
};
