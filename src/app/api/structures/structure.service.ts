import { Prisma } from "@prisma/client";

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
