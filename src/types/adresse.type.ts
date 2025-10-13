import {
  AdresseTypologie,
  CreateOrUpdateAdresseTypologie,
} from "./adresse-typologie.type";

export type Adresse = {
  id: number;
  structureDnaCode: string;
  adresse: string;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  adresseTypologies?: AdresseTypologie[];
  createdAt?: Date;
  lastUpdate?: Date;
};

export type CreateOrUpdateAdresse = Omit<
  Adresse,
  "id" | "adresseTypologies"
> & {
  id?: number;
  adresseTypologies?: CreateOrUpdateAdresseTypologie[];
};

export enum Repartition {
  COLLECTIF = "Collectif",
  DIFFUS = "Diffus",
  MIXTE = "Mixte",
}
