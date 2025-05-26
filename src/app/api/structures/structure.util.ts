import {
  Adresse,
  ControleType,
  PublicType,
  Repartition,
  StructureType,
} from "@prisma/client";
import { CreateAdresse } from "./structure.types";

export const convertToRepartition = (repartition: string): Repartition => {
  const repartitions: Record<string, Repartition> = {
    Diffus: Repartition.DIFFUS,
    Collectif: Repartition.COLLECTIF,
    Mixte: Repartition.MIXTE,
  };
  return repartitions[repartition.trim()];
};

export const convertToPublicType = (typePublic: string): PublicType => {
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
  adresses: CreateAdresse[]
): Omit<Adresse, "id" | "structureDnaCode">[] => {
  return adresses.map((adresse) => {
    return {
      adresse: adresse.adresse,
      codePostal: adresse.codePostal,
      commune: adresse.commune,
      repartition: convertToRepartition(adresse.repartition),
    };
  });
};
