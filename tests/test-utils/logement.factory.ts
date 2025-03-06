import { Logement } from "@/types/logement.type";

export const createLogement = ({ adresse }: CreateLogementsArgs): Logement => {
  return {
    id: 1,
    structureDnaCode: "C0001",
    adresse: adresse ?? "1, rue de la République",
    codePostal: "75001",
    ville: "Paris",
    qpv: true,
    logementSocial: false,
  };
};

type CreateLogementsArgs = {
  adresse?: string;
};
