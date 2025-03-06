export type Controle = {
  id: number;
  structureDnaCode: string;
  date: Date;
  type: ControleType;
};

enum ControleType {
  INOPINE,
  PROGRAMME,
}
