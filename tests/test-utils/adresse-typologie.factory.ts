import { AdresseTypologieApiType } from "@/schemas/api/adresse.schema";

export const createAdresseTypologie = ({
  placesAutorisees,
}: CreateTypologiesArgs): AdresseTypologieApiType => {
  return {
    id: 1,
    placesAutorisees: placesAutorisees ?? 5,
    date: new Date("01/01/2023").toISOString(),
    qpv: 3,
    logementSocial: 2,
  };
};

type CreateTypologiesArgs = {
  adresseId?: number;
  placesAutorisees: number;
};
