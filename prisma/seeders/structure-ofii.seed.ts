import { fakerFR as faker } from "@faker-js/faker";
import {
  Budget,
  Contact,
  FileUpload,
  Form,
  FormStep,
  Prisma,
  state,
  Structure,
  StructureOfii,
  StructureState,
  StructureTypologie,
} from "@prisma/client";

import { StructureType } from "@/types/structure.type";

import { AdresseWithTypologies, createFakeAdresses } from "./adresse.seed";
import { createFakeBudget } from "./budget.seed";
import { createFakeContact } from "./contact.seed";
import { ControleWithFileUploads, createFakeControle } from "./controle.seed";
import { createFakeFileUpload } from "./file-upload.seed";
import { createFakeFormWithSteps } from "./form.seed";
import { createFakeStructureTypologie } from "./structure-typologie.seed";

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
