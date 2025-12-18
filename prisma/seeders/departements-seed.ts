import { DEPARTEMENTS } from "@/constants";
import { Departement } from "@/generated/prisma/client";

export const createDepartements = (): Omit<Departement, "id">[] => {
  return DEPARTEMENTS.map((department) => ({
    numero: department.numero,
    name: department.name,
    region: department.region,
  }));
};
