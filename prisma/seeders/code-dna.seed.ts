import { fakerFR as faker } from "@faker-js/faker";
import { CodeDna, CodeDnaType, Contact, Prisma } from "@prisma/client";

import { createFakeContacts } from "./contact.seed";

export type CodeDnaWithRelations = CodeDna & {
    contacts: Contact[];
};

const createFakeCodeDna = (
    type: CodeDnaType,
    principalCode?: string,
): Omit<CodeDnaWithRelations, "id" | "structureId"> => {
    const codeDna = type === CodeDnaType.PRINCIPAL && principalCode
        ? principalCode
        : faker.string.alphanumeric(5).toUpperCase();
    return {
        code: codeDna,
        type,
        creationDate: faker.date.past(),
        adresseAdministrative: faker.location.streetAddress(),
        codePostalAdministratif: faker.location.zipCode(),
        communeAdministrative: faker.location.city(),
        departementAdministratif: String(faker.number.int({ min: 1, max: 95 })).padStart(2, "0"),
        latitude: Prisma.Decimal(faker.location.latitude({ min: 43.550851, max: 49.131627 })),
        longitude: Prisma.Decimal(faker.location.longitude({ min: -0.851371, max: 5.843377 })),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        contacts: createFakeContacts(codeDna) as Contact[],
    };
};

export const createFakeCodesDna = (
    structureDnaCode: string,
): Omit<CodeDnaWithRelations, "id" | "structureId">[] => {
    return [
        createFakeCodeDna(CodeDnaType.PRINCIPAL, structureDnaCode),
        ...Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () =>
            createFakeCodeDna(CodeDnaType.SECONDAIRE)
        ),
    ];
}