import { ContactApiType } from "@/schemas/api/contact.schema";

export const transformAgentFormContactsToApiContacts = (
  contacts: (Partial<ContactApiType> | undefined)[] = []
): Partial<ContactApiType>[] => {
  if (contacts.length === 0) {
    return [];
  }
  return contacts
    .filter((contact): contact is ContactApiType => contact !== undefined)
    .filter(
      (contact) =>
        contact.prenom ||
        contact.nom ||
        contact.email ||
        contact.telephone ||
        contact.role
    );
};

export const transformAjoutFormContactsToApiContacts = (
  contactPrincipal: Partial<ContactApiType> | undefined,
  contactSecondaire: Partial<ContactApiType> | undefined
): Partial<ContactApiType>[] => {
  const contacts: Partial<ContactApiType>[] = [];

  if (contactPrincipal) {
    contacts.push(contactPrincipal);
  }

  if (
    contactSecondaire &&
    contactSecondaire.prenom &&
    contactSecondaire.prenom.trim() !== "" &&
    contactSecondaire.nom &&
    contactSecondaire.nom.trim() !== "" &&
    contactSecondaire.email &&
    contactSecondaire.email.trim() !== "" &&
    contactSecondaire.telephone &&
    contactSecondaire.telephone.trim() !== "" &&
    contactSecondaire.role &&
    contactSecondaire.role.trim() !== ""
  ) {
    contacts.push(contactSecondaire);
  }

  return contacts;
};
