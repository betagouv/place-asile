import { Controle, ControleType } from "@/types/controle.type";

export const createControle = ({ id, date }: CreateControleArgs): Controle => {
  return {
    id: id ?? 1,
    structureDnaCode: "C0001",
    date: date ?? new Date("01/02/2022"),
    type: ControleType.INOPINE,
  };
};

type CreateControleArgs = {
  id?: number;
  date?: Date;
};
