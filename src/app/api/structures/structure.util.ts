import { getCoordinates } from "@/app/utils/adresse.util";
import { Prisma, Structure, StructureType } from "@/generated/prisma/client";
import { PublicType } from "@/generated/prisma/client";
import {
  StructureScalarFieldsType,
  StructureUpdateApiType,
} from "@/schemas/api/structure.schema";
import { PrismaTransaction } from "@/types/prisma.type";

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

/**
 * Prépare et exécute l'upsert de la structure (champs propres, pas les relations)
 */
export const buildBaseStructureData = async (
  tx: PrismaTransaction,
  structure: StructureUpdateApiType
): Promise<Structure> => {
  // Extraire uniquement les champs scalaires (exclure les relations)
  const {
    public: publicType,
    departementAdministratif,
    operateur,
    adresseAdministrative,
    codePostalAdministratif,
    communeAdministrative,
    filiale,
    type,
    placesACreer,
    placesAFermer,
    echeancePlacesACreer,
    echeancePlacesAFermer,
    latitude,
    longitude,
    nom,
    date303,
    debutConvention,
    finConvention,
    creationDate,
    finessCode,
    lgbt,
    fvvTeh,
    debutPeriodeAutorisation,
    finPeriodeAutorisation,
    notes,
    nomOfii,
    directionTerritoriale,
    activeInOfiiFileSince,
    inactiveInOfiiFileSince,
  }: StructureScalarFieldsType = structure;

  const baseData: Prisma.StructureCreateInput | Prisma.StructureUpdateInput = {
    filiale,
    type: type ? convertToStructureType(type) : undefined,
    latitude: latitude ? Prisma.Decimal(latitude) : undefined,
    longitude: longitude ? Prisma.Decimal(longitude) : undefined,
    nom,
    date303,
    debutConvention,
    finConvention,
    creationDate,
    finessCode,
    lgbt,
    fvvTeh,
    public: publicType ? convertToPublicType(publicType) : undefined,
    debutPeriodeAutorisation,
    finPeriodeAutorisation,
    placesACreer,
    placesAFermer,
    echeancePlacesACreer,
    echeancePlacesAFermer,
    notes,
    nomOfii,
    directionTerritoriale,
    activeInOfiiFileSince,
    inactiveInOfiiFileSince,
    departement: departementAdministratif
      ? {
          connect: {
            numero: departementAdministratif,
          },
        }
      : undefined,
    operateur: operateur
      ? {
          connect: {
            id: operateur.id,
          },
        }
      : undefined,
  };

  // Si on a les champs d'adresse, calculer les coordonnées pour le create
  let createData = baseData;
  if (
    adresseAdministrative &&
    codePostalAdministratif &&
    communeAdministrative
  ) {
    const fullAdress = `${adresseAdministrative}, ${codePostalAdministratif} ${communeAdministrative}`;
    const coordinates = await getCoordinates(fullAdress);
    createData = {
      ...baseData,
      adresseAdministrative,
      codePostalAdministratif,
      communeAdministrative,
      latitude: Prisma.Decimal(coordinates.latitude || 0),
      longitude: Prisma.Decimal(coordinates.longitude || 0),
    } as Prisma.StructureCreateInput;
  }

  return await tx.structure.upsert({
    where: {
      dnaCode: structure.dnaCode,
    },
    create: {
      ...createData,
      dnaCode: structure.dnaCode,
    } as Prisma.StructureCreateInput,
    update: baseData as Prisma.StructureUpdateInput,
  });
};
