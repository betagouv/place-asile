import { FormAdresse } from "@/schemas/base/adresse.schema";
import {
  Adresse,
  CreateOrUpdateAdresse,
  Repartition,
} from "@/types/adresse.type";

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

export const transformFormAdressesToApiAdresses = (
  adresses?: FormAdresse[],
  dnaCode?: string
): CreateOrUpdateAdresse[] => {
  if (!adresses) {
    return [];
  }
  return adresses
    .filter(
      (adresse) =>
        adresse.adresse !== "" &&
        adresse.codePostal !== "" &&
        adresse.commune !== ""
    )
    .filter((adresse) => adresse.structureDnaCode || dnaCode)
    .map((adresse) => {
      return {
        id: adresse.id,
        structureDnaCode: adresse.structureDnaCode || (dnaCode as string),
        adresse: adresse.adresse,
        codePostal: adresse.codePostal,
        commune: adresse.commune,
        repartition: adresse.repartition,
        adresseTypologies: adresse.adresseTypologies?.map(
          (adresseTypologie) => ({
            ...adresseTypologie,
            placesAutorisees: Number(adresseTypologie.placesAutorisees),
            logementSocial: adresseTypologie.logementSocial
              ? Number(adresseTypologie.placesAutorisees)
              : 0,
            qpv: adresseTypologie.qpv
              ? Number(adresseTypologie.placesAutorisees)
              : 0,
          })
        ),
      };
    });
};

export const transformApiAdressesToFormAdresses = (
  adresses: Adresse[] = []
): FormAdresse[] => {
  // We add adresseComplete (who is not saved in db) to the adresses
  // We also convert logementSocial and qpv to boolean
  // And also convert repartition db value to form value (capitalize only the first letter)
  let formAdresses: FormAdresse[] = [];
  if (adresses.length > 0) {
    formAdresses = adresses.map((adresse) => ({
      ...adresse,
      repartition: (adresse.repartition.charAt(0).toUpperCase() +
        adresse.repartition.slice(1).toLowerCase()) as Repartition,
      adresseComplete: [adresse.adresse, adresse.codePostal, adresse.commune]
        .filter(Boolean)
        .join(" ")
        .trim(),
      adresseTypologies: adresse.adresseTypologies?.map((adresseTypologie) => ({
        ...adresseTypologie,
        logementSocial: adresseTypologie.logementSocial ? true : false,
        qpv: adresseTypologie.qpv ? true : false,
      })),
    }));
  }
  return formAdresses;
};

type Coordinates = {
  latitude: number | undefined;
  longitude: number | undefined;
};
