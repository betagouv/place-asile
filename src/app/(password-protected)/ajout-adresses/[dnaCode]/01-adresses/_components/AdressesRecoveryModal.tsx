"use client";

import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useMemo } from "react";

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
          Vous n’avez plus qu’à valider le formulaire pour finaliser
          l’enregistrement
        </p>
      ) : (
        <p>
          Aucune adresse n’a été récupérée. Assurez-vous d’utiliser le même
          poste et le même navigateur que lors de la création de la structure.
          Si ce n’est pas possible, ou si le cache a été vidé, le formulaire
          devra être rempli manuellement.
        </p>
      )}
    </adressesRecoveryModal.Component>
  );
};
