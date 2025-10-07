import { Adresse } from "@/types/adresse.type";
import { AdresseTypologie } from "@/types/adresse-typologie.type";

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

type AdresseTypologieWithBooleans = Omit<
  AdresseTypologie,
  "logementSocial" | "qpv"
> & {
  logementSocial: boolean;
  qpv: boolean;
};

export type FormAdresse = Omit<Adresse, "adresseTypologies"> & {
  adresseComplete: string;
  adresseTypologies?: Partial<AdresseTypologieWithBooleans>[];
};

export type AddAdresse = Omit<
  FormAdresse,
  "adresseTypologies" | "structureDnaCode"
> & {
  adresseTypologies: AdresseTypologieWithBooleans[];
};
