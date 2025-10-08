export type AdresseTypologie = {
  id: number;
  adresseId: number;
  placesAutorisees: number;
  date: string;
  qpv: number;
  logementSocial: number;
};

export type CreateOrUpdateAdresseTypologie = Omit<
  AdresseTypologie,
  "id" | "adresseId"
> & {
  id?: number;
  adresseId?: number;
};
