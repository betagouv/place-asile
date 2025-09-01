import { AdresseTypologie } from "@/types/adresse-typologie.type";

export const createAdresseTypologie = ({
  adresseId,
  placesAutorisees,
}: CreateTypologiesArgs): AdresseTypologie => {
  return {
    id: 1,
    adresseId: adresseId ?? 1,
    placesAutorisees: placesAutorisees ?? 5,
    date: new Date("01/01/2023"),
    qpv: 3,
    logementSocial: 2,
  };
};

type CreateTypologiesArgs = {
  adresseId?: number;
  placesAutorisees: number;
};
