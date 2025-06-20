"use client";

import { ReactElement, useState } from "react";
import { useStructureContext } from "../context/StructureContext";

export const ContactsViewer = (): ReactElement => {
  const [showContacts, setShowContacts] = useState(false);
  const { structure } = useStructureContext();

  const {
    nom,
    adresseAdministrative,
    codePostalAdministratif,
    communeAdministrative,
    contacts,
  } = structure || {};

  return (
    <>
      <strong className="fr-pr-2w">Adresse administrative</strong>
      <span className="fr-pr-1w">
        {nom ? `${nom}, ` : ""}
        {adresseAdministrative}, {codePostalAdministratif}{" "}
        {communeAdministrative}
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
        <div className="text-mention-grey">
          {contacts?.map((contact) => (
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
