import { Contact, ContactType } from "@/types/contact.type";

export const transformAgentFormContactsToApiContacts = (
  contacts: (Partial<Contact> | undefined)[] = []
): Partial<Contact>[] => {
  if (contacts.length === 0) {
    return [];
  }
  return contacts
    .filter((contact): contact is Contact => contact !== undefined)
    .filter((contact: Contact) =>
      Object.values(contact).every((field) => field !== undefined)
    );
};

export const transformAjoutFormContactsToApiContacts = (
  contactPrincipal: Partial<Contact> | undefined,
  contactSecondaire: Partial<Contact> | undefined
): Partial<Contact>[] => {
  const contacts: Partial<Contact>[] = [];

  if (contactPrincipal) {
    contacts.push({ ...contactPrincipal, type: ContactType.PRINCIPAL });
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
    contacts.push({ ...contactSecondaire, type: ContactType.SECONDAIRE });
  }

  return contacts;
};
