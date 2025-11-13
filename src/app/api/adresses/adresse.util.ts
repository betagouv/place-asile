import { Adresse, Repartition } from "@prisma/client";

import {
  AdresseApiType,
  AdresseTypologieApiType,
} from "@/schemas/api/adresse.schema";

export const convertToRepartition = (
  repartition: string | undefined
): Repartition => {
  const repartitions: Record<string, Repartition> = {
    Diffus: Repartition.DIFFUS,
    Collectif: Repartition.COLLECTIF,
    Mixte: Repartition.MIXTE,
  };
  return repartitions[repartition?.trim() ?? ""];
};

export const handleAdresses = (
  dnaCode: string,
  adresses: AdresseApiType[]
): AdresseInput[] => {
  return adresses.map(
    (adresse) =>
      ({
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: convertToRepartition(adresse.repartition),
        structureDnaCode: dnaCode,
        adresseTypologies: adresse.adresseTypologies,
      }) as AdresseInput
  );
};

export type AdresseWithTypologies = Adresse & {
  adresseTypologies: AdresseTypologieApiType[];
};

export type AdresseInput = Omit<AdresseWithTypologies, "id"> & {
  createdAt?: Date;
  updatedAt?: Date;
};
