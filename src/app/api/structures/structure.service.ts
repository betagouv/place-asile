import { Prisma, Structure } from "@prisma/client";
import {
  StructureWithLatLng,
  StructureType,
  PublicType,
  StructureState,
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

export const addCoordinates = (
  structures: Structure[]
): StructureWithLatLng[] => {
  return structures.map((structure) => ({
    ...structure,
    latitude: structure.latitude.toNumber(),
    longitude: structure.longitude.toNumber(),
    type: structure.type as StructureType,
    public: structure.public as PublicType,
    state: structure.state as StructureState,
    coordinates: [
      structure.latitude.toNumber(),
      structure.longitude.toNumber(),
    ],
  }));
};
