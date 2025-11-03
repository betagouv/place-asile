import { PublicType, StructureType } from "@prisma/client";

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

export const convertToControleType = (
  controleType: string | undefined
): ControleType => {
  if (!controleType) return ControleType.INOPINE;
  const typesControles: Record<string, ControleType> = {
    Inopiné: ControleType.INOPINE,
    Programmé: ControleType.PROGRAMME,
  };
  return typesControles[controleType.trim()];
};

export const handleAdresses = (
  structureId: number,
  adresses: AdresseApiType[]
): AdresseInput[] => {
  return adresses.map(
    (adresse) =>
      ({
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: convertToRepartition(adresse.repartition),
        structureId: structureId,
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
