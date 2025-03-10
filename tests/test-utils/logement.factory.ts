import { Logement } from "@/types/logement.type";

export const createLogement = ({
  adresse,
  nbPlaces,
  ville,
}: CreateLogementsArgs): Logement => {
  return {
    id: 1,
    structureDnaCode: "C0001",
    adresse: adresse ?? "1, rue de la République",
    codePostal: "75001",
    ville: ville ?? "Paris",
    qpv: true,
    logementSocial: false,
    nbPlaces: nbPlaces ?? 3,
  };
};

type CreateLogementsArgs = {
  adresse?: string;
  nbPlaces?: number;
  ville?: string;
};
