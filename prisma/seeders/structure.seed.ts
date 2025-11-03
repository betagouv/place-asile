import { fakerFR as faker } from "@faker-js/faker";
import { Adresse, Budget, CodeDna, Controle, FileUpload, Form,Prisma, PublicType, Structure, StructureState, StructureTypologie } from "@prisma/client";

import { isStructureAutorisee } from "@/app/utils/structure.util";
import { StructureType } from "@/types/structure.type";

import { createFakeAdresses } from "./adresse.seed";
import { createFakeBudget } from "./budget.seed";
import { createFakeControle } from "./controle.seed";
import { createFakeFileUpload } from "./file-upload.seed";
import { createFakeFormWithSteps } from "./form.seed";
import { generateDatePair } from "./seed-util";
import { createFakeStructureTypologie } from "./structure-typologie.seed";

let counter = 1;

const generateDnaCode = ({ cpom, type }: FakeStructureOptions): string => {
  const cpomLabel = cpom ? "CPOM" : "SANS_CPOM";
  return `${type}-${cpomLabel}-${counter++}`;
};

const createFakeStructure = ({
  cpom,
  type,
  state,
}: FakeStructureOptions): Omit<Structure, "id" | "operateurId"> => {
  const [debutConvention, finConvention] = generateDatePair();
  const [debutPeriodeAutorisation, finPeriodeAutorisation] = generateDatePair();
  const [debutCpom, finCpom] = generateDatePair();

  const isAutorisee = isStructureAutorisee(type);

  return {
    dnaCode: generateDnaCode({
      cpom,
      type,
      state,
    }),
    // TODO : remove, deprecated
    oldOperateur: "Ancien opérateur : à supprimer",
    // TODO : à gérer quand les filiales d'opérateurs seront en DB
    filiale: "",
    type,
    // TODO : remove, deprecated
    oldNbPlaces: -1,
    adresseAdministrative: faker.location.streetAddress(),
    communeAdministrative: faker.location.city(),
    codePostalAdministratif: faker.location.zipCode(),
    departementAdministratif: String(
      faker.number.int({ min: 1, max: 95 })
    ).padStart(2, "0"),
    latitude: Prisma.Decimal(
      faker.location.latitude({ min: 43.550851, max: 49.131627 })
    ),
    longitude: Prisma.Decimal(
      faker.location.longitude({ min: -0.851371, max: 5.843377 })
    ),
    nom: faker.lorem.words(2),
    debutConvention,
    finConvention,
    cpom,
    creationDate: faker.date.past(),
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
    state,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

type StructureWithRelations = Structure & {
  codesDna: Partial<CodeDna>[];
  adresses: Partial<Adresse>[];
  controles: Partial<Controle>[];
  structureTypologies: Partial<StructureTypologie>[];
  budgets: Partial<Budget>[];
  fileUploads: Partial<FileUpload>[];
  forms: Partial<Form>[];
};

export const createFakeStuctureWithRelations = ({
  cpom,
  type,
  state,
  formDefinitionId,
  stepDefinitionIds,
}: FakeStructureOptions & {
  formDefinitionId: number;
  stepDefinitionIds: number[];
}): Omit<StructureWithRelations, "id" | "operateurId"> => {
  const fakeStructure = createFakeStructure({ cpom, type, state });
  const placesAutorisees = faker.number.int({ min: 1, max: 100 });

  let structureWithRelations: Omit<StructureWithRelations, "id" | "operateurId"> = {
    ...fakeStructure,
    codesDna: [],
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
    forms: [
      createFakeFormWithSteps(formDefinitionId, stepDefinitionIds),
    ],
    budgets: [],
    controles: [],
  };

  if (state === StructureState.FINALISE) {
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
  state: StructureState;
};
