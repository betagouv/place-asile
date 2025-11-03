import { fakerFR as faker } from "@faker-js/faker";
import { Contact, ContactType } from "@prisma/client";

const createFakeContact = (codeDnaCode: string, type: ContactType): Omit<Contact, "id" | "structureDnaCode"> => {
  const prenom = faker.person.firstName();
  const nom = faker.person.lastName();

  return {
    codeDnaCode: codeDnaCode,
    prenom,
    nom,
    telephone: faker.phone.number(),
    email: faker.internet.email({ firstName: prenom, lastName: nom }),
    role: faker.helpers.arrayElement(["Directeur", "Contact"]),
    type,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

export const createFakeContacts = (
  codeDnaCode: string
): Omit<Contact, "id" | "structureDnaCode">[] => {
  return [
    createFakeContact(codeDnaCode, "PRINCIPAL"),
    createFakeContact(codeDnaCode, "SECONDAIRE"),
  ];
}
