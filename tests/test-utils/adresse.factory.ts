import { Adresse, Repartition } from "@/types/adresse.type";
import { AdresseTypologie } from "@/types/adresse-typologie.type";

export const createAdresse = ({
  id,
  adresse,
  commune,
  typologies,
  repartition,
}: CreateLogementsArgs): Adresse => {
  return {
    id: id ?? 1,
    structureDnaCode: "C0001",
    adresse: adresse ?? "1, rue de la République",
    codePostal: "75001",
    commune: commune ?? "Paris",
    repartition: repartition ?? Repartition.DIFFUS,
    typologies: typologies ?? [],
  };
};

type CreateLogementsArgs = {
  id?: number;
  adresse?: string;
  commune?: string;
  typologies?: AdresseTypologie[];
  repartition?: Repartition;
};
