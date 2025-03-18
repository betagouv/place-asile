import { Typologie } from "@/types/typologie.type";

export const createTypologie = ({
  adresseId,
  nbPlacesTotal,
}: CreateTypologiesArgs): Typologie => {
  return {
    id: 1,
    adresseId: adresseId ?? 1,
    nbPlacesTotal: nbPlacesTotal ?? 5,
    date: new Date("01/01/2023"),
    qpv: true,
    logementSocial: false,
  };
};

type CreateTypologiesArgs = {
  adresseId?: number;
  nbPlacesTotal: number;
};
