import {
  Adresse,
  ControleType,
  PublicType,
  Repartition,
  StructureType,
} from "@prisma/client";
import z from "zod";

import { parseFrDate } from "@/app/utils/date.util";
import {
  AdresseApiType,
  AdresseTypologieApiType,
} from "@/schemas/api/adresse.schema";

export const convertToRepartition = (repartition: string): Repartition => {
  const repartitions: Record<string, Repartition> = {
    Diffus: Repartition.DIFFUS,
    Collectif: Repartition.COLLECTIF,
    Mixte: Repartition.MIXTE,
  };
  return repartitions[repartition.trim()];
};

export const convertToPublicType = (
  typePublic: string | null | undefined
): PublicType => {
  if (!typePublic) return PublicType.TOUT_PUBLIC;

  const typesPublic: Record<string, PublicType> = {
    "tout public": PublicType.TOUT_PUBLIC,
    famille: PublicType.FAMILLE,
    "personnes isolées": PublicType.PERSONNES_ISOLEES,
  };
  return typesPublic[typePublic.trim().toLowerCase()];
};

export const convertToStructureType = (
  structureType: string
): StructureType => {
  const typesStructures: Record<string, StructureType> = {
    CADA: StructureType.CADA,
    HUDA: StructureType.HUDA,
    CPH: StructureType.CPH,
    CAES: StructureType.CAES,
    PRAHDA: StructureType.PRAHDA,
  };
  return typesStructures[structureType.trim()];
};

export const convertToControleType = (controleType: string): ControleType => {
  const typesControles: Record<string, ControleType> = {
    Inopiné: ControleType.INOPINE,
    Programmé: ControleType.PROGRAMME,
  };
  return typesControles[controleType.trim()];
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

type AdresseInput = Omit<AdresseWithTypologies, "id"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export const frDateField = () =>
  z.preprocess(parseFrDate, z.coerce.date().optional());

export const mandatoryFrDateField = () =>
  z.preprocess(parseFrDate, z.coerce.date());
