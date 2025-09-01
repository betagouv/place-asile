import { StructureTypologie } from "@/types/structure-typologie.type";

export const createStructureTypologie = (): StructureTypologie => {
  return {
    id: 1,
    date: new Date("01/01/2023"),
    fvvTeh: 5,
    lgbt: 4,
    placesAutorisees: 10,
    pmr: 3,
  };
};
