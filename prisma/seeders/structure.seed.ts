import { fakerFR as faker } from "@faker-js/faker";
import {
  Prisma,
  PublicType,
  StructureType,
  Structure,
  Contact,
} from "@prisma/client";
import { createFakeContact } from "./contact.seed";
import { AdresseWithTypologies, createFakeAdresses } from "./adresse.seed";

let counter = 1;

const generateDnaCode = (type: StructureType): string => {
  const firstLetter = type.toString()[0];
  return `${firstLetter}000${counter++}`;
};

const generateDatePair = (): Date[] => {
  const date1 = faker.date.past({ years: 1 });
  const date2 = faker.date.between({
    from: date1,
    to: faker.date.future({ years: 1 }),
  });
  return [date1, date2];
};

type StructureWithRelations = Structure & {
  contacts: Omit<Contact, "id" | "structureDnaCode">[];
  adresses: Omit<AdresseWithTypologies, "id" | "structureDnaCode">[];
};

export const createFakeStructure = ({
  cpom,
  type,
}: FakeStructureOptions): Omit<StructureWithRelations, "id"> => {
  const [debutConvention, finConvention] = generateDatePair();
  const [debutPeriodeAutorisation, finPeriodeAutorisation] = generateDatePair();
  const [debutCpom, finCpom] = generateDatePair();

  return {
    dnaCode: generateDnaCode(type),
    // TODO : refactor this with real operators from DB
    operateur: faker.helpers.arrayElement([
      "ADOMA",
      "FTDA",
      "GROUPE SOS SOLIDARITES",
      "PASSERELLES",
      "FRANCE HORIZON",
    ]),
    // TODO : gérer les filiales quand la table opérateur sera en DB
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
    contacts: [createFakeContact(), createFakeContact()],
    adresses: createFakeAdresses(),
  };
};

type FakeStructureOptions = {
  cpom: boolean;
  type: StructureType;
};
