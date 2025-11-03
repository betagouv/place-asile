import { fakerFR as faker } from "@faker-js/faker";
import { Adresse, AdresseTypologie, PrismaClient, Repartition } from "@prisma/client";

import { createFakeAdresseTypologie } from "./adresse-typologie.seed";

export type AdresseWithTypologies = Adresse & {
  adresseTypologies: Omit<AdresseTypologie, "id" | "adresseId">[];
};

export const createFakeAdresses = ({
  placesAutorisees,
}: CreateFakeAdressesArgs): Omit<
  AdresseWithTypologies,
  "id" | "structureId" | "structureDnaCode" | "codeDnaId"
>[] => {
  const count = faker.number.int({ min: 1, max: 10 });
  const hasCollectif = faker.datatype.boolean();
  const collectifIndex = hasCollectif
    ? faker.number.int({ min: 0, max: count - 1 })
    : -1;

  return Array.from({ length: count }, (_, index) =>
    createFakeAdresse({
      placesAutorisees,
      repartition:
        index === collectifIndex ? Repartition.COLLECTIF : Repartition.DIFFUS,
    })
  );
};

export async function insertAdresses(
  prisma: PrismaClient,
  structureId: number,
  adresses: Omit<
    AdresseWithTypologies,
    "id" | "structureId"
  >[]
): Promise<void> {
  for (const adresse of adresses || []) {
    const createdAdresse = await prisma.adresse.create({
      data: {
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: adresse.repartition,
        structureId,
      },
    });
    for (const typ of adresse.adresseTypologies) {
      await prisma.adresseTypologie.create({
        data: {
          adresseId: createdAdresse.id,
          placesAutorisees: typ.placesAutorisees,
          date: typ.date,
          qpv: typ.qpv,
          logementSocial: typ.logementSocial,
        },
      });
    }
  }
}

const createFakeAdresse = ({
  placesAutorisees,
  repartition,
}: CreateFakeAdresseArgs): Omit<
  AdresseWithTypologies,
  "id" | "structureId" | "structureDnaCode" | "codeDnaId"
> => {
  return {
    adresse: faker.location.streetAddress(),
    codePostal: faker.location.zipCode(),
    commune: faker.location.city(),
    repartition,
    adresseTypologies: [
      createFakeAdresseTypologie({ year: 2025, placesAutorisees }),
      createFakeAdresseTypologie({ year: 2024, placesAutorisees }),
      createFakeAdresseTypologie({ year: 2023, placesAutorisees }),
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
};

type CreateFakeAdressesArgs = {
  placesAutorisees: number;
};

type CreateFakeAdresseArgs = {
  placesAutorisees: number;
  repartition: Repartition;
};
