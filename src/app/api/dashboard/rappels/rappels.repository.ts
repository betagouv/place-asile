import { includedStructureWhere } from "@/app/api/structures/structure.db.type";
import prisma from "@/lib/prisma";

import { rappelStructureSelect } from "./rappels.db.type";

export const findRappelStructures = () =>
  prisma.structure.findMany({
    where: includedStructureWhere,
    select: rappelStructureSelect,
  });
