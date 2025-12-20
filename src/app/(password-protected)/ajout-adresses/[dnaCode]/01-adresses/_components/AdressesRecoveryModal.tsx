"use client";

import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useEffect, useMemo } from "react";

const adressesRecoveryModal = createModal({
  id: "adresses-recovery-modal",
  isOpenedByDefault: true,
});
export const AdressesRecoveryModal = ({
  numAdressesRecovered,
}: {
  numAdressesRecovered: number;
}) => {
  const title = useMemo(() => {
    if (numAdressesRecovered) {
      if (numAdressesRecovered === 1) {
        return `${numAdressesRecovered} adresse a été récupérée`;
      }
      return `${numAdressesRecovered} adresses ont été récupérées`;
    }
    return "Aucune adresse n'a été récupérée";
  }, [numAdressesRecovered]);

  useEffect(() => {
    // I don't get why but the modal is not always open when the component is mounted
    const timeout = setTimeout(() => {
      adressesRecoveryModal.open();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <adressesRecoveryModal.Component
      title={title}
      buttons={[
        {
          doClosesModal: true,
          children: "J’ai compris",
          type: "button",
        },
      ]}
    >
      {numAdressesRecovered ? (
        <p>
          Vous n’avez plus qu’à valider le formulaire pour finaliser la
          récupération des adresses.
        </p>
      ) : (
        <p>
          Aucune adresse n’a été récupérée. Êtes-vous bien sur le même poste que
          celui utilisé pour la création de la structure ?
        </p>
      )}
    </adressesRecoveryModal.Component>
  );
};
