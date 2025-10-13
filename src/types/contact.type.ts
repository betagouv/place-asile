export type Contact = {
  id: number;
  structureDnaCode: string;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  role: string;
  type: ContactType;
  createdAt?: Date;
  lastUpdate?: Date;
};

export enum ContactType {
  PRINCIPAL = "PRINCIPAL",
  SECONDAIRE = "SECONDAIRE",
  AUTRE = "AUTRE",
}