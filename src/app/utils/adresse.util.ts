import { Repartition } from "@/types/adresse.type";

export const getCoordinates = async (address: string): Promise<Coordinates> => {
  const result = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1`
  );
  const data = await result.json();
  const coordinates = data?.features?.[0]?.geometry?.coordinates;
  return {
    longitude: coordinates?.[0],
    latitude: coordinates?.[1],
  };
};

type Coordinates = {
  latitude: number | undefined;
  longitude: number | undefined;
};

export type FormAdresse = {
  adresse: string;
  adresseComplete: string;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  places: number;
  qpv: boolean;
  logementSocial: boolean;
};
