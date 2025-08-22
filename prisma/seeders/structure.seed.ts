import { fakerFR as faker } from "@faker-js/faker";
import {
  Prisma,
  PublicType,
  StructureType,
  Structure,
  Contact,
  StructureTypologie,
  Budget,
  FileUpload,
  StructureState,
} from "@prisma/client";
import { createFakeContact } from "./contact.seed";
import { AdresseWithTypologies, createFakeAdresses } from "./adresse.seed";
import { ControleWithFileUploads, createFakeControle } from "./controle.seed";
import { createFakeStructureTypologie } from "./structure-typologie.seed";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { createFakeBudget } from "./budget.seed";
import { generateDatePair } from "./seed-util";
import { createFakeFileUpload } from "./file-upload.seed";

let counter = 1;

const generateDnaCode = ({
  cpom,
  type,
  state,
}: FakeStructureOptions): string => {
  const cpomLabel = cpom ? "CPOM" : "SANS_CPOM";
  const stateLabel =
    state === StructureState.FINALISE ? "FINALISE" : "A_FINALISER";
  return `${type}-${cpomLabel}-${stateLabel}-${counter++}`;
};

const createFakeStructure = ({
  cpom,
  type,
  state,
}: FakeStructureOptions): Omit<Structure, "id" | "operateurId"> => {
  const [debutConvention, finConvention] = generateDatePair();
  const [debutPeriodeAutorisation, finPeriodeAutorisation] = generateDatePair();
  const [debutCpom, finCpom] = generateDatePair();

  return {
    dnaCode: generateDnaCode({
      cpom,
      type,
      state,
    }),
    oldOperateur: "Ancien opérateur : à supprimer",
    // TODO : à gérer quand les filiales d'opérateurs seront en DB
    filiale: "",
    type,
    nbPlaces: faker.number.int(100),
    adresseAdministrative: faker.location.streetAddress(),
    communeAdministrative: faker.location.city(),
    codePostalAdministratif: faker.location.zipCode(),
    departementAdministratif: faker.location.county(),
    latitude: Prisma.Decimal(
      faker.location.latitude({ min: 48.963188, max: 49.131627 })
    ),
    longitude: Prisma.Decimal(
      faker.location.longitude({ min: -0.851371, max: 5.843377 })
    ),
    nom: faker.lorem.words(2),
    debutConvention,
    finConvention,
    cpom,
    creationDate: faker.date.past(),
    finessCode: faker.number.int(1000000000).toString(),
    lgbt: faker.datatype.boolean(),
    fvvTeh: faker.datatype.boolean(),
    public: faker.helpers.enumValue(PublicType),
    debutPeriodeAutorisation,
    finPeriodeAutorisation,
    debutCpom,
    finCpom,
    placesACreer: faker.number.int(100),
    placesAFermer: faker.number.int(100),
    echeancePlacesACreer: faker.date.future(),
    echeancePlacesAFermer: faker.date.future(),
    notes: faker.lorem.lines(2),
    state,
  };
};

type StructureWithRelations = Structure & {
  contacts: Omit<Contact, "id" | "structureDnaCode">[];
  adresses: Omit<AdresseWithTypologies, "id" | "structureDnaCode">[];
  controles: Omit<ControleWithFileUploads, "id" | "structureDnaCode">[];
  structureTypologies: Omit<StructureTypologie, "id" | "structureDnaCode">[];
  budgets: Omit<Budget, "id" | "structureDnaCode">[];
  fileUploads: Omit<FileUpload, "id" | "structureDnaCode" | "controleId">[];
};

export const createFakeStuctureWithRelations = ({
  cpom,
  type,
  state,
}: FakeStructureOptions): Omit<StructureWithRelations, "id"> => {
  const fakeStructure = createFakeStructure({ cpom, type, state });
  const isAutorisee = isStructureAutorisee(type);

  let structureWithRelations = {
    ...fakeStructure,
    contacts: [createFakeContact(), createFakeContact()],
    adresses: createFakeAdresses(),
    structureTypologies: [
      createFakeStructureTypologie({ year: 2025 }),
      createFakeStructureTypologie({ year: 2024 }),
      createFakeStructureTypologie({ year: 2023 }),
    ],
    // We'll create parent-child relationships in the database after initial creation
    // since we need the parent IDs which are only available after database insertion
    fileUploads: [
      createFakeFileUpload({}),
      createFakeFileUpload({}),
      createFakeFileUpload({}),
      createFakeFileUpload({}),
      createFakeFileUpload({}),
      createFakeFileUpload({}),
    ],
  } as StructureWithRelations;

  if (state === StructureState.FINALISE) {
    structureWithRelations = {
      ...structureWithRelations,
      budgets: isAutorisee
        ? [
            createFakeBudget({ year: 2025 }),
            createFakeBudget({ year: 2024 }),
            createFakeBudget({ year: 2023 }),
            createFakeBudget({ year: 2022 }),
            createFakeBudget({ year: 2021 }),
          ]
        : [
            createFakeBudget({ year: 2023 }),
            createFakeBudget({ year: 2022 }),
            createFakeBudget({ year: 2021 }),
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
