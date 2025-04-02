export type Controle = {
  id: number;
  structureDnaCode: string;
  date: Date;
  type: ControleType;
};

export enum ControleType {
  INOPINE = "Inopiné",
  PROGRAMME = "Programmé",
}
