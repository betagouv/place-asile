import { AdresseTypologie } from "./adresse-typologie.type";

export type Adresse = {
  id: number;
  structureDnaCode: string;
  adresse: string;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  typologies?: AdresseTypologie[];
};

export enum Repartition {
  COLLECTIF = "Collectif",
  DIFFUS = "Diffus",
  MIXTE = "Mixte",
}
