import { StructureType } from "@/types/structure.type";

export type StructureOfiiType = {
  dnaCode: string;
  type: StructureType;
  nom: string;
  operateur: {
    id: number;
    name: string;
  };
  departement: {
    id: number;
    numero: string;
    name: string;
  };
};
