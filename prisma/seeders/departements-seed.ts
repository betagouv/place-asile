import { Departement } from "@prisma/client";
import { DEPARTEMENTS } from "@/constants";

export const createDepartements = (): Omit<Departement, "id">[] => {
    return DEPARTEMENTS.map((department) => ({
        numero: department.numero,
        name: department.name,
        region: department.region
    }));
}