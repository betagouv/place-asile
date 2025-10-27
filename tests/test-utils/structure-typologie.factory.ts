import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";

export const createStructureTypologie = (): StructureTypologieApiType => {
  return {
    id: 1,
    date: new Date("01/01/2023").toISOString(),
    fvvTeh: 5,
    lgbt: 4,
    placesAutorisees: 10,
    pmr: 3,
  };
};
