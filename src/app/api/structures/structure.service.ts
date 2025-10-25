import { Prisma } from "@prisma/client";

import { StructureSimpleApiType } from "@/schemas/api/structure.schema";
import { Repartition } from "@/types/adresse.type";
import {
  PublicType,
  StructureState,
  StructureType,
} from "@/types/structure.type";

export type StructureWithActivites = Prisma.StructureGetPayload<{
  include: { activites: true };
}>;

export const addPresencesIndues = (structure: StructureWithActivites) => {
  const activitesWithPresencesIndues = structure.activites.map((activite) => {
    const presencesIndues =
      (activite?.presencesInduesBPI || 0) +
      (activite?.presencesInduesDeboutees || 0);
    return {
      ...activite,
      presencesIndues,
    };
  });

  return {
    ...structure,
    activites: activitesWithPresencesIndues,
  };
};

export const formatStructuresFromDbToApi = (
  structures: Prisma.StructureGetPayload<{
    include: {
      adresses: {
        include: {
          adresseTypologies: true;
        };
      };
      operateur: true;
      structureTypologies: true;
      forms: {
        include: {
          formDefinition: true;
        };
      };
    };
  }>[]
): StructureSimpleApiType[] => {
  return structures.map((structure) => ({
    ...structure,
    latitude: structure.latitude.toNumber(),
    longitude: structure.longitude.toNumber(),
    type: structure.type as StructureType,
    public: structure.public as PublicType,
    finessCode: structure.finessCode ?? undefined,
    filiale: structure.filiale ?? undefined,
    state: structure.state as StructureState,
    creationDate: structure.creationDate.toISOString(),
    nom: structure.nom ?? undefined,
    debutConvention: structure.debutConvention?.toISOString(),
    finConvention: structure.finConvention?.toISOString(),
    debutPeriodeAutorisation: structure.debutPeriodeAutorisation?.toISOString(),
    finPeriodeAutorisation: structure.finPeriodeAutorisation?.toISOString(),
    debutCpom: structure.debutCpom?.toISOString(),
    finCpom: structure.finCpom?.toISOString(),
    echeancePlacesACreer: structure.echeancePlacesACreer?.toISOString(),
    echeancePlacesAFermer: structure.echeancePlacesAFermer?.toISOString(),
    createdAt: structure.createdAt.toISOString(),
    updatedAt: structure.updatedAt.toISOString(),
    operateur: structure.operateur
      ? {
          ...structure.operateur,
          createdAt: structure.operateur.createdAt.toISOString(),
          updatedAt: structure.operateur.updatedAt.toISOString(),
        }
      : undefined,
    adresses: structure.adresses.map((adresse) => ({
      ...adresse,
      adresse: adresse.adresse ?? undefined,
      codePostal: adresse.codePostal ?? undefined,
      commune: adresse.commune ?? undefined,
      repartition: adresse.repartition as Repartition,
      adresseTypologies: adresse.adresseTypologies.map((typologie) => ({
        ...typologie,
        date: typologie.date.toISOString(),
        createdAt: typologie.createdAt.toISOString(),
        updatedAt: typologie.updatedAt.toISOString(),
      })),
      createdAt: adresse.createdAt.toISOString(),
      updatedAt: adresse.updatedAt.toISOString(),
    })),
    structureTypologies: structure.structureTypologies.map((typologie) => ({
      ...typologie,
      placesAutorisees: typologie.placesAutorisees ?? 0,
      pmr: typologie.pmr ?? 0,
      lgbt: typologie.lgbt ?? 0,
      fvvTeh: typologie.fvvTeh ?? 0,
      date: typologie.date.toISOString(),
      createdAt: typologie.createdAt.toISOString(),
      updatedAt: typologie.updatedAt.toISOString(),
    })),
    forms: structure.forms.map((form) => ({
      ...form,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    })),
  }));
};
