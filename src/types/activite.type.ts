export type Activite = {
  id: number;
  adresseId: number;
  date: Date;
  nbPlaces: number;
  desinsectisation: number;
  remiseEnEtat: number;
  sousOccupation: number;
  travaux: number;
  placesIndisponibles: number;
  placesVacantes: number;
  presencesInduesBPI: number;
  presencesInduesDeboutees: number;
  presencesIndues: number;
  createdAt?: Date;
  updatedAt?: Date;
};
