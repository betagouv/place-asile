import { includedStructureWhere } from "@/app/api/structures/structure.db.type";
import prisma from "@/lib/prisma";

import { dashboardStructureSelect } from "./initialisations-actualisations.db.type";

export const findDashboardStructures = () =>
  prisma.structure.findMany({
    where: includedStructureWhere,
    select: dashboardStructureSelect,
  });

export const findFormDefinitionDeadline = (slug: string) =>
  prisma.formDefinition.findUnique({
    where: { slug },
    select: { deadline: true },
  });
