import { fakerFR as faker } from "@faker-js/faker";

import { isStructureAutorisee } from "@/app/utils/structure.util";
import {
  Budget,
  Contact,
  FileUpload,
  Form,
  FormStep,
  Prisma,
  PublicType,
  Structure,
  StructureTypologie,
} from "@/generated/prisma/client";
import { StructureType } from "@/types/structure.type";

import { AdresseWithTypologies, createFakeAdresses } from "./adresse.seed";
import { createFakeBudget } from "./budget.seed";
import { createFakeContact } from "./contact.seed";
import { ControleWithFileUploads, createFakeControle } from "./controle.seed";
import { createFakeFileUpload } from "./file-upload.seed";
import { createFakeFormWithSteps } from "./form.seed";
import { generateDatePair } from "./seed-util";
import { createFakeStructureTypologie } from "./structure-typologie.seed";

let counter = 1;

// TODO: re-add a way to name with the fact the structure is, or has been part of a CPOM
const generateDnaCode = ({
  type,
  operateurName,
  departementAdministratif,
}: Partial<FakeStructureOptions>): string => {
  return `${type}-${operateurName}-${departementAdministratif}-${counter++}`;
};

export const createFakeStructure = ({
  cpom,
  type,
  ofii,
  operateurName,
  departementAdministratif,
}: FakeStructureOptions): Partial<Structure> => {
  const [debutConvention, finConvention] = generateDatePair();
  const [debutPeriodeAutorisation, finPeriodeAutorisation] = generateDatePair();
  const [debutCpom, finCpom] = generateDatePair();

  const isAutorisee = isStructureAutorisee(type);

  const creationDate = faker.date.past();

  if (ofii) {
    const createdAt = faker.date.past();
    return {
      dnaCode: generateDnaCode({
        type,
        operateurName,
        departementAdministratif,
      }),
      type,
      nom: faker.lorem.words(2),
      nomOfii: faker.lorem.words(2),
      departementAdministratif,
      directionTerritoriale: "DT " + faker.location.city(),
      createdAt,
      updatedAt: createdAt,
      activeInOfiiFileSince: createdAt,
      inactiveInOfiiFileSince:
        faker.helpers.maybe(
          () =>
            faker.date.between({
              from: createdAt,
              to: new Date(),
            }),
          { probability: 0.1 }
        ) ?? null,
    };
  }

  return {
    dnaCode: generateDnaCode({
      type,
      operateurName,
      departementAdministratif,
    }),
    // TODO : à gérer quand les filiales d'opérateurs seront en DB
    filiale: "",
    type,
    adresseAdministrative: faker.location.streetAddress(),
    communeAdministrative: faker.location.city(),
    codePostalAdministratif: faker.location.zipCode(),
    departementAdministratif,
    latitude: Prisma.Decimal(
      faker.location.latitude({ min: 43.550851, max: 49.131627 })
    ),
    longitude: Prisma.Decimal(
      faker.location.longitude({ min: -0.851371, max: 5.843377 })
    ),
    nom: faker.lorem.words(2),
    date303: null,
    debutConvention,
    finConvention,
    cpom,
    creationDate,
    finessCode: isAutorisee ? faker.number.int(1000000000).toString() : null,
    lgbt: faker.datatype.boolean(),
    fvvTeh: faker.datatype.boolean(),
    public: faker.helpers.enumValue(PublicType),
    debutPeriodeAutorisation: isAutorisee ? debutPeriodeAutorisation : null,
    finPeriodeAutorisation: isAutorisee ? finPeriodeAutorisation : null,
    debutCpom: cpom ? debutCpom : null,
    finCpom: cpom ? finCpom : null,
    placesACreer: faker.number.int(100),
    placesAFermer: faker.number.int(100),
    echeancePlacesACreer: faker.date.future(),
    echeancePlacesAFermer: faker.date.future(),
    notes: faker.lorem.lines(2),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    nomOfii: faker.lorem.words(2),
    directionTerritoriale: "DT " + faker.location.city(),
    activeInOfiiFileSince:
      faker.helpers.maybe(
        () => faker.date.between({ from: creationDate, to: new Date() }),
        { probability: 0.01 }
      ) ?? null,
    inactiveInOfiiFileSince:
      faker.helpers.maybe(
        () => faker.date.between({ from: creationDate, to: new Date() }),
        { probability: 0.01 }
      ) ?? null,
  };
};

type StructureWithRelations = Structure & {
  contacts: Omit<Contact, "id" | "structureDnaCode">[];
  adresses: Omit<AdresseWithTypologies, "id" | "structureDnaCode">[];
  controles: Omit<ControleWithFileUploads, "id" | "structureDnaCode">[];
  structureTypologies: Omit<StructureTypologie, "id" | "structureDnaCode">[];
  budgets: Omit<Budget, "id" | "structureDnaCode">[];
  fileUploads: Omit<
    FileUpload,
    "id" | "structureDnaCode" | "controleId" | "parentFileUploadId"
  >[];
  forms: (Omit<Form, "id" | "structureDnaCode"> & {
    formSteps: Omit<FormStep, "id" | "formId">[];
  })[];
};

export const createFakeStuctureWithRelations = ({
  cpom,
  type,
  isFinalised,
  formDefinitionId,
  stepDefinitions,
  ofii,
  operateurName,
  departementAdministratif,
}: FakeStructureWithRelationsOptions): Omit<StructureWithRelations, "id"> => {
  const fakeStructure = createFakeStructure({
    cpom,
    type,
    isFinalised,
    ofii,
    operateurName,
    departementAdministratif,
  });
  const placesAutorisees = faker.number.int({ min: 1, max: 100 });

  const forms = [
    createFakeFormWithSteps(formDefinitionId, stepDefinitions, {
      isFinalised,
    }),
  ];
  const [finalisationForm] = forms;
  finalisationForm.status = isFinalised;

  let structureWithRelations = {
    ...fakeStructure,
    contacts: [createFakeContact("PRINCIPAL"), createFakeContact("SECONDAIRE")],
    adresses: createFakeAdresses({ placesAutorisees }),
    structureTypologies: [
      createFakeStructureTypologie({ year: 2025, placesAutorisees }),
      createFakeStructureTypologie({ year: 2024, placesAutorisees }),
      createFakeStructureTypologie({ year: 2023, placesAutorisees }),
    ],

    fileUploads: Array.from({ length: 5 }, () =>
      createFakeFileUpload({
        cpom,
        structureType: type,
      })
    ),
    forms,
  } as StructureWithRelations;

  if (isFinalised) {
    structureWithRelations = {
      ...structureWithRelations,
      budgets: [
        createFakeBudget({ year: 2025, type, cpom }),
        createFakeBudget({ year: 2024, type, cpom }),
        createFakeBudget({ year: 2023, type, cpom }),
        createFakeBudget({ year: 2022, type, cpom }),
        createFakeBudget({ year: 2021, type, cpom }),
      ],
      controles: [
        createFakeControle(),
        createFakeControle(),
        createFakeControle(),
      ],
    };
  }

  return structureWithRelations;
};

export type FakeStructureOptions = {
  cpom: boolean;
  type: StructureType;
  isFinalised: boolean;
  ofii: boolean;
  operateurName: string;
  departementAdministratif: string;
};

export type FakeStructureWithRelationsOptions = {
  cpom: boolean;
  type: StructureType;
  isFinalised: boolean;
  ofii: boolean;
  operateurName: string;
  departementAdministratif: string;
  formDefinitionId: number;
  stepDefinitions: { id: number; slug: string }[];
};
