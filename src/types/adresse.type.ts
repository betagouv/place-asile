import { Typologie } from "./typologie.type";

export type Adresse = {
  id: number;
  structureDnaCode: string;
  adresse: string;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  typologies?: Typologie[];
};

export enum Repartition {
  DIFFUS = "Diffus",
  COLLECTIF = "Collectif",
  MIXTE = "Mixte",
}
