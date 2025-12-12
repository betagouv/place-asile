import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";

export const createStructureTypologie = (): StructureTypologieApiType => {
  return {
    id: 1,
    year: 2023,
    fvvTeh: 5,
    lgbt: 4,
    placesAutorisees: 10,
    pmr: 3,
  };
};
