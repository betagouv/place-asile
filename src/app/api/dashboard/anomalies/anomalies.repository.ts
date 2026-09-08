import { includedStructureWhere } from "@/app/api/structures/structure.db.type";
import prisma from "@/lib/prisma";

import { anomalieStructureSelect } from "./anomalies.db.type";

export const findAnomalieStructures = () =>
  prisma.structure.findMany({
    where: includedStructureWhere,
    select: anomalieStructureSelect,
  });
