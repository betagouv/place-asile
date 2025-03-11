"use client";

import { Contact } from "@/types/contact.type";
import { ReactElement, useState } from "react";

export const AdresseViewer = ({
  nom,
  adresse,
  codePostal,
  commune,
  contacts,
}: Props): ReactElement => {
  const [showContacts, setShowContacts] = useState(false);

  return (
    <>
      <strong className="fr-pr-2w">Adresse administrative</strong>
      <span className="fr-pr-1w">
        {nom ? `${nom}, ` : ""}
        {adresse}, {codePostal} {commune}
      </span>
      <button
        className={`fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline ${
          showContacts ? "fr-icon-eye-off-line" : "fr-icon-eye-line"
        }`}
        onClick={() => setShowContacts(!showContacts)}
      >
        {showContacts ? "Masquer les contacts" : "Voir les contacts"}
      </button>
      {showContacts && (
        <div className="text-grey">
          {contacts.map((contact) => (
            <div key={contact.email}>
              <strong className="fr-pr-3w">
                {contact.prenom} {contact.nom} ({contact.role})
              </strong>
              <span className="fr-pr-3w">{contact.email}</span>
              <span>{contact.telephone}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

type Props = {
  nom: string | null;
  adresse: string;
  codePostal: string;
  commune: string;
  contacts: Contact[];
};
