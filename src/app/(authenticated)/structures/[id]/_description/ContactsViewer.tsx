"use client";

import { ReactElement, useState } from "react";

import { formatPhoneNumber } from "@/app/utils/phone.util";
import { Repartition } from "@/types/adresse.type";

import { useStructureContext } from "../context/StructureClientContext";

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
      <div className="flex items-center">
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
              <div key={contact.email} className="pb-1">
                <strong className="fr-pr-3w">
                  {contact.prenom} {contact.nom} ({contact.role})
                </strong>
                <span className="fr-pr-3w">{contact.email}</span>
                <span>{formatPhoneNumber(contact.telephone)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {(() => {
        // If there is only one address and it is collective and different from the administrative address, show it as Adresse d'hébergement
        const collectiveAddress =
          structure?.adresses &&
          structure.adresses.length === 1 &&
          structure.adresses[0].repartition.toUpperCase() ===
            Repartition.COLLECTIF.toUpperCase()
            ? structure.adresses[0]
            : null;

        const { adresse, codePostal, commune } = collectiveAddress || {};
        return (
          collectiveAddress &&
          adresseAdministrative !== adresse && (
            <>
              <hr />
              <div className="flex items-center">
                <strong className="pr-2">Adresse d&apos;hébergement</strong>
                {adresse}, {codePostal} {commune}
              </div>
            </>
          )
        );
      })()}
    </>
  );
};
