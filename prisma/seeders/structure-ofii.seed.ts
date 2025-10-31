import { fakerFR as faker } from "@faker-js/faker";
import { StructureOfii } from "@prisma/client";

import { StructureType } from "@/types/structure.type";

let counter = 1;

const generateDnaCode = ({
  type,
  operateurId,
  departementId,
}: FakeStructureOfiiOptions): string => {
  return `${type}-${operateurId}-${departementId}-${counter++}`;
};

export const createFakeStructureOfii = ({
  type,
  operateurId,
  departementId,
}: FakeStructureOfiiOptions): Omit<StructureOfii, "id"> => {
  return {
    dnaCode: generateDnaCode({
      type,
      operateurId,
      departementId,
    }),
    type,
    nom: faker.lorem.words(2),
    operateurId,
    departementId,
  };
};

export type FakeStructureOfiiOptions = {
  type: StructureType;
  operateurId: number;
  departementId: number;
};
