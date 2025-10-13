import { fakerFR as faker } from "@faker-js/faker";
import {
  Budget,
  Contact,
  FileUpload,
  Prisma,
  PublicType,
  Structure,
  StructureState,
  StructureTypologie,
} from "@prisma/client";

import { isStructureAutorisee } from "@/app/utils/structure.util";
import { StructureType } from "@/types/structure.type";

import { AdresseWithTypologies, createFakeAdresses } from "./adresse.seed";
import { createFakeBudget } from "./budget.seed";
import { createFakeContact } from "./contact.seed";
import { ControleWithFileUploads, createFakeControle } from "./controle.seed";
import { createFakeFileUpload } from "./file-upload.seed";
import { generateDatePair } from "./seed-util";
import { createFakeStructureTypologie } from "./structure-typologie.seed";

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
    departementAdministratif: faker.location.county(),
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
    lastUpdate: faker.date.past(),
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
};

export const createFakeStuctureWithRelations = ({
  cpom,
  type,
  state,
}: FakeStructureOptions): Omit<StructureWithRelations, "id"> => {
  const fakeStructure = createFakeStructure({ cpom, type, state });
  const placesAutorisees = faker.number.int({ min: 1, max: 100 });

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
  } as StructureWithRelations;

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
