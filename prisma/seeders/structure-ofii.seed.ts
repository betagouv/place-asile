import { fakerFR as faker } from "@faker-js/faker";
import { StructureOfii } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

let counter = 1;

const generateDnaCode = ({
  type,
  operateurId,
  departementNumero,
}: FakeStructureOfiiOptions): string => {
  return `${type}-${operateurId}-${departementNumero}-${counter++}`;
};

export const createFakeStructureOfii = ({
  type,
  operateurId,
  departementNumero,
}: FakeStructureOfiiOptions): Omit<StructureOfii, "id"> => {
  return {
    dnaCode: generateDnaCode({
      type,
      operateurId,
      departementNumero,
    }),
    type,
    nom: faker.lorem.words(2),
    operateurId,
    departementNumero,
    directionTerritoriale: "DT " + faker.location.city(),
    nomOfii: faker.lorem.words(2),
  };
};

export type FakeStructureOfiiOptions = {
  type: StructureType;
  operateurId: number;
  departementNumero: string;
};
