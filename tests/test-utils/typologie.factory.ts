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
    qpv: 3,
    logementSocial: 2,
    lgbt: 5,
    fvvTeh: 0,
  };
};

type CreateTypologiesArgs = {
  adresseId?: number;
  nbPlacesTotal: number;
};
