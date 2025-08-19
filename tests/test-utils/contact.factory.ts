import { Contact } from "@/types/contact.type";

export const createContact = ({
  id,
  prenom,
  nom,
  telephone,
  email,
  role,
}: CreateContactArgs): Contact => {
  return {
    id: id ?? 1,
    structureDnaCode: "C0001",
    prenom: prenom ?? "John",
    nom: nom ?? "Doe",
    telephone: telephone ?? "0123456789",
    email: email ?? "john.doe@example.com",
    role: role ?? "Directeur",
  };
};

type CreateContactArgs = {
  id?: number;
  prenom?: string;
  nom?: string;
  telephone?: string;
  email?: string;
  role?: string;
};
