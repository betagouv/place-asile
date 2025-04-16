import { Prisma } from "@prisma/client";

export type StructureWithActivites = Prisma.StructureGetPayload<{
  include: { activites: true };
}>;

export const addPlacesIndues = (structure: StructureWithActivites) => {
  const activitesWithPlacesIndues = structure.activites.map((activite) => {
    const placesIndues =
      (activite?.placesPIBPI || 0) + (activite?.placesPIdeboutees || 0);
    return {
      ...activite,
      placesIndues,
    };
  });

  return {
    ...structure,
    activites: activitesWithPlacesIndues,
  };
};
