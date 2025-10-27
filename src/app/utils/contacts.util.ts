import { ContactApiType } from "@/schemas/api/contact.schema";
import { ContactType } from "@/types/contact.type";

export const transformAgentFormContactsToApiContacts = (
  contacts: (Partial<ContactApiType> | undefined)[] = []
): Partial<ContactApiType>[] => {
  if (contacts.length === 0) {
    return [];
  }
  return contacts
    .filter((contact): contact is ContactApiType => contact !== undefined)
    .filter((contact: ContactApiType) =>
      Object.values(contact).every((field) => field !== undefined)
    );
};

export const transformAjoutFormContactsToApiContacts = (
  contactPrincipal: Partial<ContactApiType> | undefined,
  contactSecondaire: Partial<ContactApiType> | undefined
): Partial<ContactApiType>[] => {
  const contacts: Partial<ContactApiType>[] = [];

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
